class Calculator {

public:

    Calculator() {}

    int add(int a, int b) {

        return a + b;

    }

    int subtract(int a, int b) {

        return a - b;

    }

    int multiply(int a, int b) {

        return a * b;

    }

    int divide(int a, int b) {

        if (b == 0) {

            cerr << "Error: Division by zero" << endl;

            return 0;

        }

        return a / b;

    }

};

void print_vector(const vector<int>& vec) {

    for (int num : vec) {

        cout << num << " ";

    }

    cout << endl;

}

int main() {

    int x = 10;

    int y = 20;

    Calculator calc;

    cout << "Addition: " << calc.add(x, y) << endl;

    cout << "Subtraction: " << calc.subtract(x, y) << endl;

    cout << "Multiplication: " << calc.multiply(x, y) << endl;

    cout << "Division: " << calc.divide(x, y) << endl;

    vector<int> numbers = {1, 2, 3, 4, 5};

    cout << "Original vector: ";

    print_vector(numbers);

    sort(numbers.begin(), numbers.end(), greater<int>());

    cout << "Sorted vector (descending): ";

    print_vector(numbers);

    return 0;

class MathOperations {

public:

    MathOperations() {}

    double add(double a, double b) {

        return a + b;

    }

    double subtract(double a, double b) {

        return a - b;

    }

    double multiply(double a, double b) {

        return a * b;

    }

    double divide(double a, double b) {

        if (b == 0) {

            cerr << "Division by zero is not allowed" << endl;

            return 0.0;

        }

        return a / b;

    }

    double square_root(double a) {

        if (a < 0) {

            cerr << "Square root of negative number is not allowed" << endl;

            return -1.0;

        }

        return sqrt(a);

    }

};

void print_list(const list<string>& lst) {

    for (const auto& item : lst) {

        cout << item << " ";

    }

    cout << endl;

}

int main() {

    MathOperations mathOps;

    cout << "Addition: " << mathOps.add(a, b) << endl;

    cout << "Subtraction: " << mathOps.subtract(a, b) << endl;

    cout << "Multiplication: " << mathOps.multiply(a, b) << endl;

    cout << "Division: " << mathOps.divide(a, b) << endl;

    cout << "Square Root: " << mathOps.square_root(a) << endl;
