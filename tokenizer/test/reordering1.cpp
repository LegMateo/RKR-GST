#include <iostream>
using namespace std;

int main() {
    int num;
    cout << "Enter a number: ";
    cin >> num;

    cout << "Square of " << num << " is " << square(num) << endl;
    cout << "Factorial of " << num << " is " << factorial(num) << endl;

    return 0;
}

int square(int x) {  // Reordered to appear after main
    return x * x;
}

int factorial(int n) {  // Reordered to appear after square
    if (n == 0) return 1;
    return n * factorial(n - 1);
}