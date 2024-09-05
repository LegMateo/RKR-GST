#include <iostream>
#include <vector>

// Plagiarized Section
void printVector(const std::vector<int>& vec) {
    for(int num : vec) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
}

int add(int a, int b) {
    return a + b;
}

double multiply(double a, double b) {
    return a * b;
}

// Unique Section
int mod(int a, int b) {
    if (b == 0) {
        std::cerr << "Error: Modulo by zero!" << std::endl;
        return 0;
    }
    return a % b;
}

double power(double base, int exponent) {
    double result = 1.0;
    for (int i = 0; i < exponent; ++i) {
        result *= base;
    }
    return result;
}

void uniqueFunction2() {
    std::cout << "This is a unique function in Code 2." << std::endl;
}