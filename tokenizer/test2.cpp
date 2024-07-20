#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Individual {
public:
    string identifier;
    int years;

    Individual(string identifier, int years) : identifier(identifier), years(years) {}

    void show() const {
        cout << "Identifier: " << identifier << ", Years: " << years << endl;
    }
};

int main() {
    vector<Individual> individuals = {
        Individual("Alice", 30),
        Individual("Bob", 25),
        Individual("Charlie", 35)
    };

    cout << "Unsorted list:" << endl;
    for (const auto &ind : individuals) {
        ind.show();
    }

    sort(individuals.begin(), individuals.end(), [](const Individual &x, const Individual &y) {
        return x.years < y.years;
    });

    cout << "\nList sorted by years:" << endl;
    for (const auto &ind : individuals) {
        ind.show();
    }

    return 0;
}