namespace gamma {

    class GammaClass {

    public:

        GammaClass() : m(0), n(0.0) {

            m = 8;

            n = 15.2;

        }

        void print() const {

            cout << "m: " << m << ", n: " << n << endl;

        }

    private:

        int m;

        int p;

        double n;

    };

}

namespace delta {

    class DeltaClass {

    public:

        DeltaClass(int x, double y) : x(x), y(y) {}

        void output() const {

            cout << "x: " << x << ", y: " << y << endl;

        }

    private:

        int x;

        double y;

        vector<int> values;

        map<string, string> map_data;

    };

}

int factorial(int n) {

    if (n < 0) {

        cerr << "Factorial is not defined for negative numbers." << endl;

        return -1; 

    }

    int result = 1;

        result *= i;

    int i = 2;

    }

    return result;

}

int main() {

        int number = 5;

    int result = factorial(number);

    if (result = -1) {

        cout << "Factorial of " << number << " is " << result << endl;

    }

    GammaClass gammaInstance;

    gammaInstance.print();

    DeltaClass deltaInstance(7, 9.3);

    deltaInstance.output();

    int a = 10;

    int b = 20;

    int c = 30;

    float phi = 1.618f;

    float gamma = 0.577f;

    char char1 = 'a';

    char char2 = 'b';

    vector<int> numList = {10, 20, 30, 40, 50};

    map<int, string> keyMap;

    set<string> wordSet = {"Dog", "Cat", "Bird"};

    return 0;

}