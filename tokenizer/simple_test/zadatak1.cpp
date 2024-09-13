// Essential headers
#include <iostream>
#include <vector>
#include <map>
#include <set>
#include <string>
#include <algorithm>

/* 
   Documentation:
   This code defines two classes within different namespaces,
   showcases various STL containers, and includes basic I/O operations.
*/

namespace gamma {
    class GammaClass {
    public:
        // Default constructor
        GammaClass() : m(0), n(0.0) {
            // Setting initial values
            m = 8;
            n = 15.2;
        }

        void print() const {
            std::cout << "m: " << m << ", n: " << n << std::endl;
        }

    private:
        int m, p; // Integer members
        double n;
    };
}

namespace delta {
    // Definition of DeltaClass
    class DeltaClass {
    public:
        DeltaClass(int x, double y) : x(x), y(y) {}

        void output() const {
            std::cout << "x: " << x << ", y: " << y << std::endl;
        }

    private:
        int x;
        double y;
        std::vector<int> values;
        std::map<std::string, std::string> map_data;
    };
}

/*
    Main function:
    This function demonstrates the use of classes and STL containers.
*/

// Function to calculate the factorial of a number
int factorial(int n) {
    if (n < 0) {
        std::cerr << "Factorial is not defined for negative numbers." << std::endl;
        return -1; // Error code for invalid input
    }

    int result = 1;
    for (int i = 2; i <= n; ++i) {
        result *= i;
    }

    return result;
}

int main() {

        int number = 5;
    int result = factorial(number);
    
    if (result = -1) {
        std::cout << "Factorial of " << number << " is " << result << std::endl;
    }
    // Working with GammaClass
    gamma::GammaClass gammaInstance;
    gammaInstance.print();

    // Working with DeltaClass
    delta::DeltaClass deltaInstance(7, 9.3);
    deltaInstance.output();

    // Multiple variable declarations
    int a = 10, b = 20, c = 30; // Declaring integers
    float phi = 1.618f, gamma = 0.577f;
    char char1 = 'a', char2 = 'b';

    // STL container usage
    std::vector<int> numList = {10, 20, 30, 40, 50};
    std::map<int, std::string> keyMap;
    std::set<std::string> wordSet = {"Dog", "Cat", "Bird"};

    // End of program
    return 0;
}