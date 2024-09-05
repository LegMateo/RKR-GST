void printVector(const vector<int>& vec) {

    for(int num : vec) {

        cout << num << " ";

    }

    cout << endl;

}

int add(int a, int b) {

    return a + b;

}

double multiply(double a, double b) {

    return a * b;

}

int subtract(int a, int b) {

    return a - b;

}

int divide(int a, int b) {

    if (b == 0) {

        cerr << "Error: Division by zero!" << endl;

        return 0;

    }

    return a / b;

}

void uniqueFunction1() {

    cout << "This is a unique function in Code 1." << endl;

}