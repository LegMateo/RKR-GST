#include <iostream>
using namespace std;

int sumOfSquares(int n) {
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i * i;
    }
    return sum;
}

void printMultiplicationTable(int num) {
    for (int i = 1; i <= 10; i++) {
        cout << num << " x " << i << " = " << num * i << endl;
    }
}

int main() {
    int n, num;

    cout << "Enter a number to calculate sum of squares: ";
    cin >> n;
    cout << "Sum of squares: " << sumOfSquares(n) << endl;

    cout << "Enter a number to print its multiplication table: ";
    cin >> num;
    printMultiplicationTable(num);

    return 0;
}