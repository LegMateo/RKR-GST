#include <iostream>
#include <string>

class BankAccount {
private:
    std::string accountHolder;
    double balance;

public:
    // Constructor to initialize the account with holder's name and balance
    BankAccount(const std::string &name, double initialBalance) {
        accountHolder = name;
        balance = initialBalance;
        std::cout << "Account created for " << accountHolder << " with balance: $" << balance << "\n";
    }

    // Function to deposit money
    void deposit(double amount) {
        balance += amount;
        std::cout << "Deposited $" << amount << ". New balance: $" << balance << "\n";
    }

    // Function to withdraw money
    void withdraw(double amount) {
        if (amount > balance) {
            std::cout << "Insufficient funds! Current balance: $" << balance << "\n";
        } else {
            balance -= amount;
            std::cout << "Withdrew $" << amount << ". Remaining balance: $" << balance << "\n";
        }
    }

    // Function to display the current balance
    void showBalance() const {
        std::cout << "Account balance: $" << balance << "\n";
    }
};

int main() {
    BankAccount account1("John Doe", 1000.0);  // Initial account setup with name and balance

    int choice;
    double amount;

    do {
        std::cout << "\n1. Deposit\n2. Withdraw\n3. Show Balance\n4. Exit\n";
        std::cout << "Enter your choice: ";
        std::cin >> choice;

        switch (choice) {
            case 1:
                std::cout << "Enter deposit amount: ";
                std::cin >> amount;
                account1.deposit(amount);
                break;
            case 2:
                std::cout << "Enter withdrawal amount: ";
                std::cin >> amount;
                account1.withdraw(amount);
                break;
            case 3:
                account1.showBalance();
                break;
            case 4:
                std::cout << "Exiting program...\n";
                break;
            default:
                std::cout << "Invalid choice! Try again.\n";
        }
    } while (choice != 4);

    return 0;
}