#Tight coupling. Circular dependency
#Budget depends on Transaction, and Transaction depends on Budget
class Budget:
    def __init__(self, name):
        self._name = name
        self._transactions = []

    def add_transaction(self, transaction):
        self._transactions.append(transaction)

class Transaction:
    def __init__(self, budget):
        self._budget = budget

budget = Budget("Food")
transaction = Transaction(budget)
budget.add_transaction(transaction)
print(transaction._budget._name)






#Loose coupling.
#Transaction1 depends on Budget1, but Budget1 depends on an BudgetEnum instead of Budget1 class
import enum
class BudgetEnum(enum.Enum):
    CLOTHES = 1
    FOOD = 2

class Budget1:
    def __init__(self, budget_enum):
        self._budget_enum = budget_enum
        self._transactions = []

    def add_transaction(self, transaction1):
        self._transactions.append(transaction1)


class Transaction1:
    def __init__(self, budget_enum):
        self._budget_enum = budget_enum

budget1 = Budget1(BudgetEnum.FOOD)
transaction1 = Transaction1(BudgetEnum.FOOD)
budget1.add_transaction(transaction1)

print(transaction1._budget_enum)