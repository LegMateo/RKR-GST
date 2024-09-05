#include <iostream>
using namespace std;

int calculateArea(int length, int width) {
    return length * width;
}

int main() {
    int length, width;
    cout << "Enter length and width: ";
    cin >> length >> width;

    int area = calculateArea(length, width);
    cout << "The area of the rectangle is: " << area << endl;

    return 0;
}