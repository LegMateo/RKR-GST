%{
#include <iostream>
#include <string>
#include <map>
#include <sstream>

using namespace std;

void yyerror(const char *s);
bool isNumericType(const string &str);
bool isStringType(const string &str);

std::map<std::string, std::string> symbol_table;
std::map<int, char> token_to_char;

std::ostringstream tokenStream;  
int line_num = 1;  
int column_num = 1;  

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
    LEFT_SHIFT,   
    RIGHT_SHIFT,    
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
    FOR,
    WHILE,
    DO,
    SWITCH,
    CASE,
    BREAK,
    CONTINUE,
    VIRTUAL,
    NOT,
    MODULO,
};

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
    token_to_char[LEFT_SHIFT] = 'X';
    token_to_char[RIGHT_SHIFT] = 'Y';
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
    token_to_char[FOR] = 'q';
    token_to_char[WHILE] = 'r';
    token_to_char[DO] = 's';
    token_to_char[SWITCH] = 't';
    token_to_char[CASE] = 'u';
    token_to_char[BREAK] = 'v';
    token_to_char[CONTINUE] = 'w';
    token_to_char[VIRTUAL] = 'y';
    token_to_char[NOT] = 'z';
    token_to_char[MODULO] = 'x';
}
void add_class_name(const char* name) {
    symbol_table[name] = "class";
}

void add_function_name(const char* name) {
    symbol_table[name] = "function";
}

%}

%option noyywrap

%x CLASS_DECL FUNC_DECL

%%

[\n]                    { line_num++; column_num = 1; } 

[ \t]+                  { column_num += yyleng; /* Ignore whitespace */ }
"//".*                  { /* Ignore single-line comments */ }
\/\*([^*]|\*+[^*/])*\*\/ { /* Ignore multi-line comments */ }
^#.*  { /* Ignore preprocessor directives */ }

"private"   { column_num += yyleng; /* Ignore 'private' */ }
"protected" { column_num += yyleng; /* Ignore 'protected' */ }
"public"    { column_num += yyleng; /* Ignore 'public' */ }
"internal"  { column_num += yyleng; /* Ignore 'internal' */ }
"static"    { column_num += yyleng; /* Ignore 'static' */ }
"final"     { column_num += yyleng; /* Ignore 'final' */ }
"const"     { column_num += yyleng; /* Ignore 'const' */ }

":" { column_num += yyleng; /* Ignore ':' after access specifiers */ }

"namespace" { tokenStream << token_to_char[NAMESPACE] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return NAMESPACE; }
"class"     { BEGIN(CLASS_DECL); tokenStream << token_to_char[CLASS] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return CLASS; }
"void" {
    tokenStream << token_to_char[VOID] << ' ' << line_num << ' ' << column_num << '\n';
    column_num += yyleng;  // Update column number after "void"
    
    int c;
    while ((c = yyinput()) != EOF) {
        if (c == '\n') {
            line_num++;
            column_num = 1;
        } else if (isspace(c)) {
            column_num++;
        } else {
            unput(c);  
            break;
        }
    }

    BEGIN(FUNC_DECL);  
    return VOID;
}
"virtual"   { tokenStream << token_to_char[VIRTUAL] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return VIRTUAL; }
"cout"      { tokenStream << token_to_char[OUTPUT_STREAM] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return OUTPUT_STREAM; }
"cin"       { tokenStream << token_to_char[INPUT_STREAM] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return INPUT_STREAM; }

"return"    { tokenStream << token_to_char[RETURN] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return RETURN; }
"vector"    { tokenStream << token_to_char[VECTOR] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return VECTOR; }
"map"       { tokenStream << token_to_char[MAP] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return MAP; }
"set"       { tokenStream << token_to_char[SET] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return SET; }

"try"       { tokenStream << token_to_char[TRY] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return TRY; }
"catch"     { tokenStream << token_to_char[CATCH] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return CATCH; }
"throw"     { tokenStream << token_to_char[THROW] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return THROW; }

"if"        { tokenStream << token_to_char[IF] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return IF; }
"else"      { tokenStream << token_to_char[ELSE] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return ELSE; }
"for"      { tokenStream << token_to_char[FOR] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return FOR; }
"while"     { tokenStream << token_to_char[WHILE] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return WHILE; }
"do"        { tokenStream << token_to_char[DO] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return DO; }
"switch"    { tokenStream << token_to_char[SWITCH] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return SWITCH; }
"case"      { tokenStream << token_to_char[CASE] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return CASE; }
"break"     { tokenStream << token_to_char[BREAK] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return BREAK; }
"continue"  { tokenStream << token_to_char[CONTINUE] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return CONTINUE; }

"&"         { tokenStream << token_to_char[AND] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return AND; }
"endl"      { column_num += yyleng; /* Ignore 'endl' */ }

"!"   { tokenStream << token_to_char[NOT] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return NOT; }
"%"   { tokenStream << token_to_char[MODULO] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return MODULO; }

"["         { tokenStream << token_to_char[OPEN_BRACKET] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return OPEN_BRACKET; }
"]"         { tokenStream << token_to_char[CLOSE_BRACKET] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return CLOSE_BRACKET; }

[a-zA-Z_][a-zA-Z0-9_]* {
    string id(yytext);
    if (symbol_table.find(id) != symbol_table.end()) {
        if (symbol_table[id] == "class") {
            tokenStream << token_to_char[CLASS_NAME] << ' ' << line_num << ' ' << column_num << '\n';
            column_num += yyleng;
            return CLASS_NAME;
        } else if (symbol_table[id] == "function") {
            tokenStream << token_to_char[FUNCTION_NAME] << ' ' << line_num << ' ' << column_num << '\n';
            column_num += yyleng;
            return FUNCTION_NAME;
        }
    } else if (isNumericType(id)) {
        tokenStream << token_to_char[NUMERIC_TYPE] << ' ' << line_num << ' ' << column_num << '\n';
        column_num += yyleng;
        return NUMERIC_TYPE;
    } else if (isStringType(id)) {
        tokenStream << token_to_char[STRING_TYPE] << ' ' << line_num << ' ' << column_num << '\n';
        column_num += yyleng;
        return STRING_TYPE;
    } else {
        tokenStream << token_to_char[IDENTIFIER] << ' ' << line_num << ' ' << column_num << '\n';
        column_num += yyleng;
        return IDENTIFIER;
    }
}

[0-9]+(\.[0-9]*)?([eE][+-]?[0-9]+)? {
    tokenStream << token_to_char[NUMERIC_VALUE] << ' ' << line_num << ' ' << column_num << '\n';
    column_num += yyleng;
    return NUMERIC_VALUE;
}

\'([^\'\\]|\\.)*\' { tokenStream << token_to_char[CHAR_VALUE] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return CHAR_VALUE; }

\"([^"\\]|\\.)*\" { tokenStream << token_to_char[STRING_VALUE] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return STRING_VALUE; }

"<<"  { tokenStream << token_to_char[LEFT_SHIFT] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return LEFT_SHIFT; }
">>"  { tokenStream << token_to_char[RIGHT_SHIFT] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return RIGHT_SHIFT; }
"+"   { tokenStream << token_to_char[PLUS] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return PLUS; }
"-"   { tokenStream << token_to_char[MINUS] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return MINUS; }
"*"   { tokenStream << token_to_char[TIMES] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return TIMES; }
"/"   { tokenStream << token_to_char[DIVIDE] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return DIVIDE; }
"="   { tokenStream << token_to_char[EQUAL] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return EQUAL; }
"<"   { tokenStream << token_to_char[LESS_THAN] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return LESS_THAN; }
">"   { tokenStream << token_to_char[GREATER_THAN] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return GREATER_THAN; }
"("   { tokenStream << token_to_char[OPEN_PARENTH] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return OPEN_PARENTH; }
")"   { tokenStream << token_to_char[CLOSE_PARENTH] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return CLOSE_PARENTH; }
"{"   { tokenStream << token_to_char[OPEN_CURLY] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return OPEN_CURLY; }
"}"   { tokenStream << token_to_char[CLOSE_CURLY] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return CLOSE_CURLY; }
","   { tokenStream << token_to_char[COMMA] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return COMMA; }
"->"  { tokenStream << token_to_char[PATTERN_ARROW] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return PATTERN_ARROW; }
";"   { column_num += yyleng; /* Ignore ';' */ }
"."   { tokenStream << token_to_char[PERIOD] << ' ' << line_num << ' ' << column_num << '\n'; column_num += yyleng; return PERIOD; }

<CLASS_DECL>[a-zA-Z_][a-zA-Z0-9_]* {
    add_class_name(yytext);
    tokenStream << token_to_char[IDENTIFIER] << ' ' << line_num << ' ' << column_num << '\n';
    column_num += yyleng;
    BEGIN(INITIAL);
    return IDENTIFIER;
}

<CLASS_DECL>":" {
    tokenStream << token_to_char[COLON] << ' ' << line_num << ' ' << column_num << '\n';
    column_num += yyleng;
    BEGIN(INITIAL);
    return COLON;
}

<CLASS_DECL>"{" {
    tokenStream << token_to_char[OPEN_CURLY] << ' ' << line_num << ' ' << column_num << '\n';
    column_num += yyleng;
    BEGIN(INITIAL);
    return OPEN_CURLY;
}

<FUNC_DECL>[a-zA-Z_][a-zA-Z0-9_]* {
    add_function_name(yytext);
    tokenStream << token_to_char[IDENTIFIER] << ' ' << line_num << ' ' << column_num << '\n';
    column_num += yyleng;  // Move column number forward after processing identifier
    BEGIN(INITIAL);
    return IDENTIFIER;
}

<FUNC_DECL>"(" {
    tokenStream << token_to_char[OPEN_PARENTH] << ' ' << line_num << ' ' << column_num << '\n';
    column_num += yyleng;  // Move column number forward after processing "("
    BEGIN(INITIAL);
    return OPEN_PARENTH;
}

%%

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

    initialize_token_to_char();

    while (yylex()); 

    std::cout << tokenStream.str();

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