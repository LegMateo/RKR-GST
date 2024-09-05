#include <iostream>

int subtract(int a, int b) {
    return a - b;
}

void printMessage() {
    std::cout << "This is a basic set of functions." << std::endl;
}

void multiplyAndPrint(int a, int b) {
    std::cout << "Product: " << a * b << std::endl;
}

int main() {
    int x = 10;
    int y = 5;
    std::cout << "Sum: " << add(x, y) << std::endl;
    std::cout << "Difference: " << subtract(x, y) << std::endl;
    printMessage();
    multiplyAndPrint(x, y);
    return 0;
}