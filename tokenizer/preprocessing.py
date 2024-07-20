import re
import os

def remove_comments_and_imports_from_cpp(file_path):
    if not os.path.isfile(file_path):
        print(f"Error: The file {file_path} does not exist.")
        return
    
    with open(file_path, 'r') as file:
        code = file.readlines()
    
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

    directory, original_filename = os.path.split(file_path)
    output_file_path = os.path.join(directory, 'p_' + original_filename)

    with open(output_file_path, 'w') as file:
        file.writelines(cleaned_code)

    print(f"Comments, import statements removed, declarations split, and fully qualified names simplified. Cleaned code saved to {output_file_path}")
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

#input_file = '/Users/mateo/Desktop/tokenizer/test1.cpp'
input_file = '/Users/mateo/Desktop/tokenizer/test2.cpp'

remove_comments_and_imports_from_cpp(input_file)
