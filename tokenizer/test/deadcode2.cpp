#include <iostream>
#include <cmath>
using namespace std;

double calculateArea(double radius) {
    return M_PI * radius * radius;
}

double calculatePerimeter(double radius) {
    return 2 * M_PI * radius;
}

int main() {
    double radius;
    cout << "Enter the radius of the circle: ";
    cin >> radius;
    
    cout << "Area: " << calculateArea(radius) << endl;
    cout << "Perimeter: " << calculatePerimeter(radius) << endl;
    return 0;
}