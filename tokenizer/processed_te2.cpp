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

int mod(int a, int b) {

    if (b == 0) {

        cerr << "Error: Modulo by zero!" << endl;

        return 0;

    }

    return a % b;

}

double power(double base, int exponent) {

    double result = 1.0;

    int i = 0;

        result *= base;

    }

    return result;

}

void uniqueFunction2() {

    cout << "This is a unique function in Code 2." << endl;

}