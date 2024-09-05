#include <iostream>
#include <vector>
#include <map>
#include <set>
#include <string>

using namespace std;

namespace TestNamespace {
    class Base {
    public:
        virtual void display() const {
            cout << "Base class display" << endl;
        }
    };

    class Derived : public Base {
    public:
        void display() const override {
            cout << "Derived class display" << endl;
        }
    };

    template<typename T>
    T add(T a, T b) {
        return a + b;
    }

    void testFunction(int a, double b, const string &str) {
        cout << "Testing function with int: " << a << ", double: " << b << " and string: " << str << endl;
    }

    int main() {
        // Variables and basic data types
        int a = 10;
        float b = 20.5;
        double c = 30.123;
        char d = 'x';
        string e = "Hello, World!";

        // Pointers and references
        int* p = &a;
        int& ref = a;

        // Arrays
        int arr[5] = {1, 2, 3, 4, 5};

        // Vector, map, set
        vector<int> vec = {1, 2, 3, 4, 5};
        map<string, int> myMap = {{"one", 1}, {"two", 2}};
        set<int> mySet = {1, 2, 3, 4, 5};

        // Control structures
        if (a > 5) {
            cout << "a is greater than 5" << endl;
        } else {
            cout << "a is not greater than 5" << endl;
        }

        for (int i = 0; i < 5; ++i) {
            cout << "Loop index: " << i << endl;
        }

        while (a > 0) {
            cout << "a: " << a << endl;
            --a;
        }

        do {
            cout << "Do-while loop with a: " << a << endl;
        } while (a > 0);

        // Switch-case
        switch (b) {
            case 20.5:
                cout << "b is 20.5" << endl;
                break;
            default:
                cout << "b is not 20.5" << endl;
                break;
        }

        // Functions and templates
        testFunction(10, 20.5, "Test String");
        cout << "Template add function: " << add(10, 20) << endl;
        cout << "Template add function: " << add(10.5, 20.5) << endl;

        // Class usage
        Base baseObj;
        Derived derivedObj;
        Base* basePtr = &derivedObj;
        basePtr->display();

        // Exception handling
        try {
            throw runtime_error("An error occurred");
        } catch (const runtime_error &e) {
            cout << "Caught exception: " << e.what() << endl;
        }

        // Lambda functions
        auto lambda = [](int x, int y) { return x + y; };
        cout << "Lambda result: " << lambda(5, 3) << endl;

        // Type aliases
        using Integer = int;
        Integer x = 100;
        cout << "Type alias x: " << x << endl;

        return 0;
    }
}

int main() {
    return TestNamespace::main();
}
