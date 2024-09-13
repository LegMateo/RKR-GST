#include <iostream>
using namespace std;

int sumOfSquares(int n) {
    int sum = 0;
    int i = 1;
    while (i <= n) {
        sum += i * i;
        i++;
    }
    return sum;
}

void printMultiplicationTable(int num) {
    int i = 1;
    while (i <= 10) {
        cout << num << " x " << i << " = " << num * i << endl;
        i++;
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