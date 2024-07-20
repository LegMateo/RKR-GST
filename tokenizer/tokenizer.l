%{
#include <iostream>
#include <string>
#include <map>
#include <fstream>
#include <chrono>
#include <iomanip>
#include <sstream>

using namespace std;

void yyerror(const char *s);
bool isNumericType(const string &str);
bool isStringType(const string &str);

std::map<std::string, std::string> symbol_table;
std::ofstream token_file;

#define YY_DECL extern "C" int yylex()
void add_class_name(const char* name);
void add_function_name(const char* name);

// Define token types
enum TokenType {
    NAMESPACE = 256,
    CLASS,
    VOID,
    OUTPUT_STREAM,
    INPUT_STREAM,
    FUNCTION_CALL,
    METHOD_CALL,
    CLASS_NAME,
    FUNCTION_NAME,
    IDENTIFIER,
    NUMERIC_TYPE,
    STRING_TYPE,
    NUMERIC_VALUE,
    CHAR_VALUE,
    STRING_VALUE,
    PLUS,
    MINUS,
    TIMES,
    DIVIDE,
    EQUAL,
    LESS_THAN,
    GREATER_THAN,
    OPEN_PARENTH,
    CLOSE_PARENTH,
    OPEN_CURLY,
    CLOSE_CURLY,
    OPEN_BRACKET,
    CLOSE_BRACKET,
    COMMA,
    PATTERN_ARROW,
    COLON,
    PERIOD,
    RETURN,
    VECTOR,
    MAP,
    SET,
    TRY,
    CATCH,
    THROW,
    AND,
    IF,
    ELSE,
    WHILE,
    DO,
    SWITCH,
    CASE,
    BREAK,
    CONTINUE,
    VIRTUAL
};

std::map<int, char> token_to_char;
void initialize_token_to_char() {
    token_to_char[NAMESPACE] = 'A';
    token_to_char[CLASS] = 'B';
    token_to_char[VOID] = 'C';
    token_to_char[OUTPUT_STREAM] = 'D';
    token_to_char[INPUT_STREAM] = 'E';
    token_to_char[FUNCTION_CALL] = 'F';
    token_to_char[METHOD_CALL] = 'G';
    token_to_char[CLASS_NAME] = 'H';
    token_to_char[FUNCTION_NAME] = 'I';
    token_to_char[IDENTIFIER] = 'J';
    token_to_char[NUMERIC_TYPE] = 'K';
    token_to_char[STRING_TYPE] = 'L';
    token_to_char[NUMERIC_VALUE] = 'M';
    token_to_char[CHAR_VALUE] = 'N';
    token_to_char[STRING_VALUE] = 'O';
    token_to_char[PLUS] = 'P';
    token_to_char[MINUS] = 'Q';
    token_to_char[TIMES] = 'R';
    token_to_char[DIVIDE] = 'S';
    token_to_char[EQUAL] = 'T';
    token_to_char[LESS_THAN] = 'U';
    token_to_char[GREATER_THAN] = 'V';
    token_to_char[OPEN_PARENTH] = 'W';
    token_to_char[CLOSE_PARENTH] = 'X';
    token_to_char[OPEN_CURLY] = 'Y';
    token_to_char[CLOSE_CURLY] = 'Z';
    token_to_char[OPEN_BRACKET] = 'a';
    token_to_char[CLOSE_BRACKET] = 'b';
    token_to_char[COMMA] = 'c';
    token_to_char[PATTERN_ARROW] = 'd';
    token_to_char[COLON] = 'e';
    token_to_char[PERIOD] = 'f';
    token_to_char[RETURN] = 'g';
    token_to_char[VECTOR] = 'h';
    token_to_char[MAP] = 'i';
    token_to_char[SET] = 'j';
    token_to_char[TRY] = 'k';
    token_to_char[CATCH] = 'l';
    token_to_char[THROW] = 'm';
    token_to_char[AND] = 'n';
    token_to_char[IF] = 'o';
    token_to_char[ELSE] = 'p';
    token_to_char[WHILE] = 'q';
    token_to_char[DO] = 'r';
    token_to_char[SWITCH] = 's';
    token_to_char[CASE] = 't';
    token_to_char[BREAK] = 'u';
    token_to_char[CONTINUE] = 'v';
    token_to_char[VIRTUAL] = 'w';
}

std::string generate_unique_filename(const std::string& base_name) {
    auto now = std::chrono::system_clock::now();
    auto in_time_t = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << base_name << "_tokens_"
       << std::put_time(std::localtime(&in_time_t), "%Y%m%d%H%M%S")
       << ".txt";
    return ss.str();
}

%}

%option noyywrap

%x CLASS_DECL FUNC_DECL

%%

[ \t]+                  { /* Ignore whitespace */ }
"//".*                  { /* Ignore single-line comments */ }
\/\*([^*]|\*+[^*/])*\*\/ { /* Ignore multi-line comments */ }

"private"   { /* Ignore 'private' */ }
"protected" { /* Ignore 'protected' */ }
"public"    { /* Ignore 'public' */ }
"internal"  { /* Ignore 'internal' */ }
"static"    { /* Ignore 'static' */ }
"final"     { /* Ignore 'final' */ }
"const"     { /* Ignore 'const' */ }

":" { /* Ignore ':' after access specifiers */ }

"namespace" { token_file << token_to_char[NAMESPACE] << '\n'; return NAMESPACE; }
"class"     { BEGIN(CLASS_DECL); token_file << token_to_char[CLASS] << '\n'; return CLASS; }
"void"      { BEGIN(FUNC_DECL); token_file << token_to_char[VOID] << '\n'; return VOID; }
"virtual"   { token_file << token_to_char[VIRTUAL] << '\n'; return VIRTUAL; }
"cout"      { token_file << token_to_char[OUTPUT_STREAM] << '\n'; return OUTPUT_STREAM; }
"cin"       { token_file << token_to_char[INPUT_STREAM] << '\n'; return INPUT_STREAM; }

"return"    { token_file << token_to_char[RETURN] << '\n'; return RETURN; }
"vector"    { token_file << token_to_char[VECTOR] << '\n'; return VECTOR; }
"map"       { token_file << token_to_char[MAP] << '\n'; return MAP; }
"set"       { token_file << token_to_char[SET] << '\n'; return SET; }

"try"       { token_file << token_to_char[TRY] << '\n'; return TRY; }
"catch"     { token_file << token_to_char[CATCH] << '\n'; return CATCH; }
"throw"     { token_file << token_to_char[THROW] << '\n'; return THROW; }

"if"        { token_file << token_to_char[IF] << '\n'; return IF; }
"else"      { token_file << token_to_char[ELSE] << '\n'; return ELSE; }
"while"     { token_file << token_to_char[WHILE] << '\n'; return WHILE; }
"do"        { token_file << token_to_char[DO] << '\n'; return DO; }
"switch"    { token_file << token_to_char[SWITCH] << '\n'; return SWITCH; }
"case"      { token_file << token_to_char[CASE] << '\n'; return CASE; }
"break"     { token_file << token_to_char[BREAK] << '\n'; return BREAK; }
"continue"  { token_file << token_to_char[CONTINUE] << '\n'; return CONTINUE; }

"&"         { token_file << token_to_char[AND] << '\n'; return AND; }
"endl"      { /* Ignore 'endl' */ }

"["         { token_file << token_to_char[OPEN_BRACKET] << '\n'; return OPEN_BRACKET; }
"]"         { token_file << token_to_char[CLOSE_BRACKET] << '\n'; return CLOSE_BRACKET; }

[a-zA-Z_][a-zA-Z0-9_]*\(\) {
    string id(yytext);
    id.pop_back(); // remove the '('
    if (symbol_table.find(id) != symbol_table.end() && symbol_table[id] == "function") {
        token_file << token_to_char[FUNCTION_CALL] << '\n';
        return FUNCTION_CALL;
    } else {
        token_file << token_to_char[METHOD_CALL] << '\n';
        return METHOD_CALL;
    }
}

[a-zA-Z_][a-zA-Z0-9_]* {
    string id(yytext);
    if (symbol_table.find(id) != symbol_table.end()) {
        if (symbol_table[id] == "class") {
            token_file << token_to_char[CLASS_NAME] << '\n';
            return CLASS_NAME;
        } else if (symbol_table[id] == "function") {
            token_file << token_to_char[FUNCTION_NAME] << '\n';
            return FUNCTION_NAME;
        }
    } else if (isNumericType(id)) {
        token_file << token_to_char[NUMERIC_TYPE] << '\n';
        return NUMERIC_TYPE;
    } else if (isStringType(id)) {
        token_file << token_to_char[STRING_TYPE] << '\n';
        return STRING_TYPE;
    } else {
        token_file << token_to_char[IDENTIFIER] << '\n';
        return IDENTIFIER;
    }
}

[0-9]+(\.[0-9]*)?([eE][+-]?[0-9]+)? {
    token_file << token_to_char[NUMERIC_VALUE] << '\n';
    return NUMERIC_VALUE;
}

\'([^\'\\]|\\.)*\' { token_file << token_to_char[CHAR_VALUE] << '\n'; return CHAR_VALUE; }

\"([^"\\]|\\.)*\" { token_file << token_to_char[STRING_VALUE] << '\n'; return STRING_VALUE; }

"+"   { token_file << token_to_char[PLUS] << '\n'; return PLUS; }
"-"   { token_file << token_to_char[MINUS] << '\n'; return MINUS; }
"*"   { token_file << token_to_char[TIMES] << '\n'; return TIMES; }
"/"   { token_file << token_to_char[DIVIDE] << '\n'; return DIVIDE; }
"="   { token_file << token_to_char[EQUAL] << '\n'; return EQUAL; }
"<"   { token_file << token_to_char[LESS_THAN] << '\n'; return LESS_THAN; }
">"   { token_file << token_to_char[GREATER_THAN] << '\n'; return GREATER_THAN; }
"("   { token_file << token_to_char[OPEN_PARENTH] << '\n'; return OPEN_PARENTH; }
")"   { token_file << token_to_char[CLOSE_PARENTH] << '\n'; return CLOSE_PARENTH; }
"{"   { token_file << token_to_char[OPEN_CURLY] << '\n'; return OPEN_CURLY; }
"}"   { token_file << token_to_char[CLOSE_CURLY] << '\n'; return CLOSE_CURLY; }
","   { token_file << token_to_char[COMMA] << '\n'; return COMMA; }
"->"  { token_file << token_to_char[PATTERN_ARROW] << '\n'; return PATTERN_ARROW; }
";"   { /* Ignore */ }
"."   { token_file << token_to_char[PERIOD] << '\n'; return PERIOD; }

<CLASS_DECL>[a-zA-Z_][a-zA-Z0-9_]* {
    add_class_name(yytext);
    token_file << token_to_char[IDENTIFIER] << '\n';
    BEGIN(INITIAL);
    return IDENTIFIER;
}

<CLASS_DECL>":" {
    token_file << token_to_char[COLON] << '\n';
    BEGIN(INITIAL);
    return COLON;
}

<CLASS_DECL>"{" {
    token_file << token_to_char[OPEN_CURLY] << '\n';
    BEGIN(INITIAL);
    return OPEN_CURLY;
}

<FUNC_DECL>[a-zA-Z_][a-zA-Z0-9_]* {
    add_function_name(yytext);
    token_file << token_to_char[IDENTIFIER] << '\n';
    BEGIN(INITIAL);
    return IDENTIFIER;
}

<FUNC_DECL>"(" {
    token_file << token_to_char[OPEN_PARENTH] << '\n';
    BEGIN(INITIAL);
    return OPEN_PARENTH;
}

%%

void add_class_name(const char* name) {
    symbol_table[name] = "class";
}

void add_function_name(const char* name) {
    symbol_table[name] = "function";
}

int main(int argc, char **argv)
{
    if (argc > 1) {
        yyin = fopen(argv[1], "r");
        if (!yyin) {
            cerr << "Error: Could not open file " << argv[1] << endl;
            return 1;
        }
    } else {
        yyin = stdin;
    }

    // Generate a unique file name for each run
    std::string base_name = "tokens";
    std::string file_name = generate_unique_filename(base_name);
    token_file.open(file_name);
    if (!token_file.is_open()) {
        cerr << "Error: Could not open " << file_name << " for writing" << endl;
        return 1;
    }

    initialize_token_to_char();

    while (yylex()); // Keep calling yylex until it returns 0
    token_file.close();
    return 0;
}

void yyerror(const char *s)
{
    cerr << "Error: " << s << endl;
}

bool isNumericType(const string &str)
{
    return str == "byte" || str == "short" || str == "int" || str == "long" ||
           str == "float" || str == "double" || str == "Byte" || str == "Short" ||
           str == "Integer" || str == "Long" || str == "Float" || str == "Double";
}

bool isStringType(const string &str)
{
    return str == "std::string" || str == "char" || str == "wchar_t" || str == "char16_t" || str == "char32_t";
}