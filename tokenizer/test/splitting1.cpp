#include <iostream>
using namespace std;

int getLength() {
    int length;
    cout << "Enter the length: ";
    cin >> length;
    return length;
}

int getWidth() {
    int width;
    cout << "Enter the width: ";
    cin >> width;
    return width;
}

int calculateArea(int length, int width) {
    return length * width;
}

int main() {
    int length = getLength();
    int width = getWidth();

    int area = calculateArea(length, width);
    cout << "The area is: " << area << endl;

    return 0;
}