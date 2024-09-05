int subtract(int a, int b) {

    return a - b;

}

void printMessage() {

    cout << "This is a basic set of functions." << endl;

}

void multiplyAndPrint(int a, int b) {

    cout << "Product: " << a * b << endl;

}

int main() {

    int x = 10;

    int y = 5;

    cout << "Sum: " << add(x, y) << endl;

    cout << "Difference: " << subtract(x, y) << endl;

    printMessage();

    multiplyAndPrint(x, y);

    return 0;

}