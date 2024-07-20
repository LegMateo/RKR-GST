namespace alpha {
    class AlphaClass {
    public:
        AlphaClass() : x(0), y(0.0) {
            x = 5;
            y = 10.5;
        }
        void show() const {
            cout << "x: " << x << ", y: " << y << endl;
        }
    private:
        int x;
        int z;
        double y;
    };
}
namespace beta {
    class BetaClass {
    public:
        BetaClass(int a, double b) : a(a), b(b) {}
        void display() const {
            cout << "a: " << a << ", b: " << b << endl;
        }
    private:
        int a;
        double b;
        vector<int> vec;
        map<string, string> dict;
    };
}
int main() {
    int i = 1;
    int j = 2;
    int k = 3;
    float pi = 3.14f;
    float e = 2.718f;
    char ch1 = 'x';
    char ch2 = 'y';
    AlphaClass alphaObj;
    alphaObj.show();
    BetaClass betaObj(3, 4.5);
    betaObj.display();
    vector<int> numbers = {1, 2, 3, 4, 5};
    map<int, string> idMap;
    set<string> names = {"Alice", "Bob", "Charlie"};
    return 0;
}
