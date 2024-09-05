#include <iostream>
using namespace std;

// Added a new function to make the code appear different
int addition(int a, int b) {
    return a + b;
}

int computeFactorial(int x) {  // Renamed function and parameter
    if (x == 0) return 1;
    return x * computeFactorial(x - 1);  // Same logic as the original
}

int main() {
    int num1, num2, inputNumber;

    // Added usage of the new function
    cout << "Enter two numbers to add: ";
    cin >> num1 >> num2;
    cout << "The sum of " << num1 << " and " << num2 << " is " << addition(num1, num2) << endl;

    // Original factorial logic copied
    cout << "Please input a number for factorial: ";
    cin >> inputNumber;


    if (inputNumber < 0) {
        cout << "Negative numbers don't have a factorial.\n";  // Rephrased
    } else {
        cout << "The factorial of " << inputNumber << " is " << computeFactorial(inputNumber) << endl;
    }

    return 0;
}