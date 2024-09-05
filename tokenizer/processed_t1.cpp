int subtract(int a, int b) {

    return a - b;

}

void printMessage() {

    cout << "This is a basic set of functions." << endl;

}

int main() {

    int x = 10;

    int y = 5;

    if (x>y){

        cout << "X is greater than y " << endl;

    }

    cout << "Sum: " << add(x, y) << endl;

    cout << "Difference: " << subtract(x, y) << endl;

    printMessage();

    return 0;

}