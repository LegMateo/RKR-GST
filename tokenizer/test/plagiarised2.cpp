#include <iostream>
using namespace std;

int findFactorial(int number) {  // Renamed function and parameter
    if (number == 0) return 1;
    return number * findFactorial(number - 1);  // Same logic
}

int main() {
    int inputNumber;
    cout << "Please input a number: ";  // Changed prompt wording
    cin >> inputNumber;

    if (inputNumber < 0) {
        cout << "Negative numbers don't have a factorial.\n";  // Rephrased
    } else {
        cout << "The factorial of " << inputNumber << " is " << findFactorial(inputNumber) << endl;
    }

    return 0;
}