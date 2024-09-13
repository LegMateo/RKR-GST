#include <iostream>
#include <cmath>
using namespace std;

double calculateArea(double radius) {
    return M_PI * radius * radius;
}

double calculatePerimeter(double radius) {
    return 2 * M_PI * radius;
}

// Dead code, not used anywhere
void printHelloWorld() {
    cout << "Hello World!" << endl;
}

// Dead code, not used anywhere
int addTwoNumbers(int a, int b) {
    return a + b;
}

int main() {
    double radius;
    cout << "Enter the radius of the circle: ";
    cin >> radius;

    cout << "Area: " << calculateArea(radius) << endl;
    cout << "Perimeter: " << calculatePerimeter(radius) << endl;
    
    // Intentionally unused code
    printHelloWorld();
    return 0;
}