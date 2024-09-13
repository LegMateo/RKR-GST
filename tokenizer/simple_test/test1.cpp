#include <iostream>
#include <vector>
using namespace std;

int findMax(const vector<int>& numbers) {
    if (numbers.empty()) {
        throw invalid_argument("Array is empty");
    }

    int maxVal = numbers[0];
    for (int i = 1; i < numbers.size(); ++i) {
        if (numbers[i] > maxVal) {
            maxVal = numbers[i];
        }
    }
    return maxVal;
}

int main() {
    vector<int> numbers = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5};
    try {
        int maxValue = findMax(numbers);
        cout << "The maximum value is: " << maxValue << endl;
    } catch (const invalid_argument& e) {
        cout << e.what() << endl;
    }
    return 0;
}