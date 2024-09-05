#include <iostream>
#include <vector>
#include <algorithm>
#include <map>

class Calculator {
public:
    Calculator() {}

    int add(int a, int b) {
        return a + b;
    }

    int subtract(int a, int b) {
        return a - b;
    }

    int multiply(int a, int b) {
        return a * b;
    }

    int divide(int a, int b) {
        if (b == 0) {
            std::cerr << "Error: Division by zero" << std::endl;
            return 0;
        }
        return a / b;
    }
};

void print_vector(const std::vector<int>& vec) {
    for (int num : vec) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
}

int main() {
    Calculator calc;

    int x = 10, y = 20;
    std::cout << "Addition: " << calc.add(x, y) << std::endl;
    std::cout << "Subtraction: " << calc.subtract(x, y) << std::endl;
    std::cout << "Multiplication: " << calc.multiply(x, y) << std::endl;
    std::cout << "Division: " << calc.divide(x, y) << std::endl;

    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::cout << "Original vector: ";
    print_vector(numbers);

    std::sort(numbers.begin(), numbers.end(), std::greater<int>());
    std::cout << "Sorted vector (descending): ";
    print_vector(numbers);

    return 0;
}#include <iostream>
#include <vector>
#include <list>
#include <string>
#include <map>

class MathOperations {
public:
    MathOperations() {}

    double add(double a, double b) {
        return a + b;
    }

    double subtract(double a, double b) {
        return a - b;
    }

    double multiply(double a, double b) {
        return a * b;
    }

    double divide(double a, double b) {
        if (b == 0) {
            std::cerr << "Division by zero is not allowed" << std::endl;
            return 0.0;
        }
        return a / b;
    }

    double square_root(double a) {
        if (a < 0) {
            std::cerr << "Square root of negative number is not allowed" << std::endl;
            return -1.0;
        }
        return sqrt(a);
    }
};

void print_list(const std::list<std::string>& lst) {
    for (const auto& item : lst) {
        std::cout << item << " ";
    }
    std::cout << std::endl;
}

int main() {
    MathOperations mathOps;

    double a = 25.5, b = 12.3;
    std::cout << "Addition: " << mathOps.add(a, b) << std::endl;
    std::cout << "Subtraction: " << mathOps.subtract(a, b) << std::endl;
    std::cout << "Multiplication: " << mathOps.multiply(a, b) << std::endl;
    std::cout << "Division: " << mathOps.divide(a, b) << std::endl;
    std::cout << "Square Root: " << mathOps.square_root(a) << std::endl;

  