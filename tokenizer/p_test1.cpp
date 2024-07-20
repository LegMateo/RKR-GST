using namespace std;
class Person {
public:
    string name;
    int age;
    Person(string name, int age) : name(name), age(age) {}
    void display() const {
        cout << "Name: " << name << ", Age: " << age << endl;
    }
};
int main() {
    vector<Person> people = {
        Person("Alice", 30),
        Person("Bob", 25),
        Person("Charlie", 35)
    };
    cout << "Original list:" << endl;
    for (const auto &person : people) {
        person.display();
    }
    sort(people.begin(), people.end(), [](const Person &a, const Person &b) {
        return a.age < b.age;
    });
    cout << "\nSorted list by age:" << endl;
    for (const auto &person : people) {
        person.display();
    }
    return 0;
}