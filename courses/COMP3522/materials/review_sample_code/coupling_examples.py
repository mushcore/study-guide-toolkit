# Tight coupling.
# Library instantiates Book in its initializer
# Library ONLY works with the concrete Book class
class Book:
    def __init__(self):
        self._title = None

    def get_title(self):
        return self._title

class Library:
    def __init__(self):
        self._book = Book() #Book instantiated in Library





# Tight coupling, but less than before.
# Library1 is passed Book1 into its initializer. Dependency Injection
# Library1 ONLY works with the concrete Book1 class
class Book1:
    def __init__(self):
        self._title = None

    def get_title(self):
        return self._title

class Library1:
    def __init__(self, book1): #book1 passed into Library
        self._book1 = book1





# Loose coupling.
# Library2 is passed ItemInterface into its initializer. Dependency Injection
# Library2 can accept any type of ItemInterface, including Book2, DVD, and any future subclasses
import abc

class ItemInterface:
    @abc.abstractmethod
    def get_title(self):
        pass

class Book2(ItemInterface):
    def __init__(self):
        self._title = None

    def get_title(self):
        return self._title

class DVD(ItemInterface):
    def __init__(self):
        self._title = None
        self._director = None

    def get_title(self):
        return self._title

class Library2:
    def __init__(self, item): #ItemInterface type passed into Library
        self._item = item