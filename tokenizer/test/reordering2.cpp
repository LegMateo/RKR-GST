#include <iostream>


int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}

int square(int x) {
    return x * x;
}

int main() {
    int num;
    cout << "Enter a number: ";
    cin >> num;

    cout << "Factorial of " << num << " is " << factorial(num) << endl;
    cout << "Square of " << num << " is " << square(num) << endl;

    return 0;
}