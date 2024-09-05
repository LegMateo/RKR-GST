import re
import os
import sys
import pymongo
from gridfs import GridFS
from bson import ObjectId
from gridfs.errors import NoFile  # Import the correct NoFile exception
from dotenv import load_dotenv

# Load environment variables from a .env file if needed
load_dotenv()

def remove_comments_and_imports_from_cpp(db_name, file_id):
    try:
        # Prefix the database name with 'user_'
        db_name = f"user_{db_name}"

        # Connect to MongoDB using the prefixed database name
        mongo_uri = os.getenv('MONGODB_URI')
        client = pymongo.MongoClient(mongo_uri)
        db = client[db_name]
        fs = GridFS(db, collection='uploads')

        file = fs.get(ObjectId(file_id))
        code = file.read().decode('utf-8').splitlines()

        single_line_comments = re.compile(r'//.*')
        block_comments_start = re.compile(r'/\*')
        block_comments_end = re.compile(r'\*/')
        import_statements = re.compile(r'#include\s*<.*?>|#include\s*".*?"')
        fully_qualified_names = re.compile(r'(\w+::)+(\w+)')

        cleaned_code = []
        in_block_comment = False
        in_function = False
        function_vars = []
        function_start = None

        for line in code:
            if in_block_comment:
                if block_comments_end.search(line):
                    line = block_comments_end.sub('', line, 1)
                    in_block_comment = False
                else:
                    continue  

            if block_comments_start.search(line) and not block_comments_end.search(line):
                line = block_comments_start.sub('', line)
                in_block_comment = True

            line = single_line_comments.sub('', line)  

            if import_statements.search(line):
                continue  

            if line.strip().endswith('{') and not in_function:
                in_function = True
                function_start = len(cleaned_code)
            elif line.strip().endswith('}') and in_function:
                in_function = False
                if function_vars:
                    cleaned_code = (
                        cleaned_code[:function_start+1]
                        + function_vars
                        + cleaned_code[function_start+1:]
                    )
                    function_vars = []

            line, declarations = split_declarations(line)
            if declarations:
                if in_function:
                    function_vars.extend(declarations)
                else:
                    cleaned_code.extend(declarations)
                continue

            line = re.sub(fully_qualified_names, lambda match: match.group(2), line)
            if line.strip():
                cleaned_code.append(line)

        processed_code = '\n'.join(cleaned_code)
        fs.put(processed_code.encode('utf-8'), filename=f'p_{file.filename}', contentType='text/plain')

        return processed_code

    except NoFile:  # Correct exception handling
        print(f"No file found with ID: {file_id} in collection 'uploads'")
        return f"No file found with ID: {file_id}"

    except Exception as e:
        print(f"Unexpected error occurred: {str(e)}")
        return f"Unexpected error occurred: {str(e)}"

def split_declarations(line):
    combined_decl = re.compile(r'(\w+\s+)((?:\w+\s*=\s*[^,;]+,?\s*)+);')
    match = combined_decl.search(line)
    if match:
        type_decl = match.group(1)
        variables = match.group(2).split(',')
        leading_spaces = len(line) - len(line.lstrip())
        split_decls = [f"{' ' * leading_spaces}{type_decl}{var.strip()};\n" for var in variables]
        return '', split_decls

    single_decl = re.compile(r'(\w+\s+\w+\s*=\s*[^,;]+);')
    matches = single_decl.findall(line)
    if matches:
        leading_spaces = len(line) - len(line.lstrip())
        split_decls = [f"{' ' * leading_spaces}{match};\n" for match in matches]
        return '', split_decls

    multi_decl = re.compile(r'(\w+\s+)((?:\w+\s*,\s*)+\w+);')
    match = multi_decl.search(line)
    if match:
        type_decl = match.group(1)
        variables = match.group(2).split(',')
        leading_spaces = len(line) - len(line.lstrip())
        split_decls = [f"{' ' * leading_spaces}{type_decl}{var.strip()};\n" for var in variables]
        return '', split_decls

    return line, []

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python3 preprocessing.py <db_name> <file_id>")
        sys.exit(1)

    db_name = sys.argv[1]
    file_id = sys.argv[2]
    processed_code = remove_comments_and_imports_from_cpp(db_name, file_id)
    print(processed_code)