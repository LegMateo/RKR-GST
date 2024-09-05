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
        int a = 10;
        float b = 20.5;
        double c = 30.123;
        char d = 'x';
        string e = "Hello, World!";
        int* p = &a;
        int& ref = a;
        int arr[5] = {1, 2, 3, 4, 5};
        vector<int> vec = {1, 2, 3, 4, 5};
        map<string, int> myMap = {{"one", 1}, {"two", 2}};
        set<int> mySet = {1, 2, 3, 4, 5};
        if (a > 5) {
            cout << "a is greater than 5" << endl;
        } else {
            cout << "a is not greater than 5" << endl;
        }
            cout << "Loop index: " << i << endl;
        int i = 0;
        }
        while (a > 0) {
            cout << "a: " << a << endl;
            --a;
        }
        do {
            cout << "Do-while loop with a: " << a << endl;
        } while (a > 0);
        switch (b) {
            case 20.5:
                cout << "b is 20.5" << endl;
                break;
            default:
                cout << "b is not 20.5" << endl;
                break;
        }
        testFunction(10, 20.5, "Test String");
        cout << "Template add function: " << add(10, 20) << endl;
        cout << "Template add function: " << add(10.5, 20.5) << endl;
        Base baseObj;
        Derived derivedObj;
        Base* basePtr = &derivedObj;
        basePtr->display();
        try {
            throw runtime_error("An error occurred");
        } catch (const runtime_error &e) {
            cout << "Caught exception: " << e.what() << endl;
        }
        auto lambda = [](int x, int y) { return x + y; };
        cout << "Lambda result: " << lambda(5, 3) << endl;
        using Integer = int;
        Integer x = 100;
        cout << "Type alias x: " << x << endl;
        return 0;
    }
}
int main() {
    return main();
}
