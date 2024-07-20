// Main header includes
#include <iostream>
#include <vector>
#include <map>
#include <set>
#include <string>
#include <algorithm>

/* 
   Block comment:
   This file contains various elements such as classes, namespaces,
   complex variable declarations, and multiple comments.
*/

namespace alpha {
    class AlphaClass {
    public:
        // Constructor
        AlphaClass() : x(0), y(0.0) {
            // Initialize variables
            x = 5;
            y = 10.5;
        }

        void show() const {
            std::cout << "x: " << x << ", y: " << y << std::endl;
        }

    private:
        int x, z; // Multiple int variables
        double y;
    };
}

namespace beta {
    // BetaClass definition
    class BetaClass {
    public:
        BetaClass(int a, double b) : a(a), b(b) {}

        void display() const {
            std::cout << "a: " << a << ", b: " << b << std::endl;
        }

    private:
        int a;
        double b;
        std::vector<int> vec;
        std::map<std::string, std::string> dict;
    };
}

/*
    Another block comment:
    The main function demonstrates usage of both classes
    and various variable declarations.
*/

int main() {
    // Using AlphaClass
    alpha::AlphaClass alphaObj;
    alphaObj.show();

    // Using BetaClass
    beta::BetaClass betaObj(3, 4.5);
    betaObj.display();

    // Variable declarations
    int i = 1, j = 2, k = 3; // Combined int declarations
    float pi = 3.14f, e = 2.718f;
    char ch1 = 'x', ch2 = 'y';

    // STL containers
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::map<int, std::string> idMap;
    std::set<std::string> names = {"Alice", "Bob", "Charlie"};

    // End of main
    return 0;
}
