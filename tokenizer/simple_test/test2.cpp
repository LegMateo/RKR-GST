#include <iostream>
#include <vector>
using namespace std;

int getMaxValue(const vector<int>& arr) {
    if (arr.empty()) {
        throw invalid_argument("Array cannot be empty");
    }

    int highest = arr[0];
    for (int i = 1; i < arr.size(); ++i) {
        if (arr[i] > highest) {
            highest = arr[i];
        }
    }
    return highest;
}

int main() {
    vector<int> arr = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5};
    try {
        int maxValue = getMaxValue(arr);
        cout << "Max value found: " << maxValue << endl;
    } catch (const invalid_argument& e) {
        cout << e.what() << endl;
    }
    return 0;
}