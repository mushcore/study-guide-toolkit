class Human:
    def __init__(self, name, phone):
        """
        Initializer that saves Foot via Composition, and Phone via aggregation
        :param name: string
        :param phone: instance of Phone
        """
        self._name = name

        """
        Association: A broad has-a relationship. Occurs when class saves an object in a member variable
        Human -----> Foot
        Human -----> Phone

        Composition and aggregation are more specific versions of association

        Composition: Has-a relationship, object instantiated INSIDE the containing class.
        Object is destroyed if containing object destroyed
        ie: Foot instantiated inside of Human. Foot is destroyed if Human is destroyed
        Human ◆---- Foot
        """
        self._foot = Foot()

        """
        Aggregation: Has-a relationship, object instantiated OUTSIDE the containing class.
        Object is NOT destroyed if containing object destroyed
        ie: Phone instantiated OUTSIDE of Human. Phone still exists outside of Human if Human is destroyed
        Human ◇---- Phone
        """
        self._phone = phone

    def compute_on_computer(self, computer):
        """
        Human uses computer to perform operation
        :param computer: instance of Computer
        """

        """
        Dependency: Uses relationship, object used by containing class. Object NOT saved by containing class
        ie: Human class calls method on computer but does not save computer as a member variable
        Human - - - > Computer
        """
        computer.compute(self._name)

class Foot:
    pass

class Computer:
    def compute(self, name):
        print(name,"is computing")

class Phone:
    pass

"""
Inheritance. Is-a relationship, class is a Child of a Parent class. Child points to Parent
iPhone is a child of Phone
iPhone ----▷ Phone
"""
class iPhone(Phone):
    pass

"""
Inheritance ----▷. Is-a relationship, class is a Child of a Parent class. Child points to Parent
Android is a child of Phone
Android ----▷ Phone
"""
class Android(Phone): #inheritance
    pass


def main():
    phone = Phone() #Phone instantiated outside Human, Phone still exists if human destroyed
    computer = Computer()

    human = Human("Jeff", phone)
    human.compute_on_computer(computer)

if __name__ == '__main__':
    main()
