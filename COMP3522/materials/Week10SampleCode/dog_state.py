from abc import ABC, abstractmethod


# Abstract State class
class DogState(ABC):

    def __init__(self):
        self._dog_context = None #reference back to context to allow State to communicate to Context

    def set_context(self, dog_context):
        self._dog_context = dog_context #reference back to context to allow State to communicate to Context

    @abstractmethod
    def bark(self):
        pass

    @abstractmethod
    def wag_tail(self):
        pass

    @abstractmethod
    def feed_magic_treat(self):
        pass


# Concrete HappyState
class HappyState(DogState):
    def bark(self):
        print("Dog is happily barking!")

    def wag_tail(self):
        print("Dog is happily wagging its tail!")

    def feed_magic_treat(self):
        #demonstrates that States can communicate with the context to change to another state
        print("fed SPICY treat! Dog was happy, now is Sad :(")
        self._dog_context.set_state(SadState())


# Concrete SadState
class SadState(DogState):
    def bark(self):
        print("Dog is whimpering sadly.")

    def wag_tail(self):
        print("Dog has its tail between its legs.")

    def feed_magic_treat(self):
        # demonstrates that States can communicate with the context to change to another state
        print("fed SWEET treat! Dog was sad, now is happy :).")
        self._dog_context.set_state(HappyState())


# Context class (Dog)
class Dog:
    def __init__(self):
        self.current_state = None

    def set_state(self, new_state: DogState):
        """
        When a dog's state is changed, the current state needs to be updated to the new state.
        The new state must also point back to this context to enable 2-way communication

        @param new_state: DogState
        """
        # Clean up code. If a current state exists, reset it to point to no context before changing states
        if self.current_state is not None:
            self.current_state.set_context(None)

        self.current_state = new_state
        new_state.set_context(self)

    def bark(self):
        self.current_state.bark()

    def wag_tail(self):
        self.current_state.wag_tail()

    def feed_magic_treat(self):
        self.current_state.feed_magic_treat()


if __name__ == "__main__":
    dog = Dog()

    # Dog is initially happy
    dog.set_state(HappyState())

    # Simulate actions in different states
    dog.bark()
    dog.wag_tail()
    dog.feed_magic_treat() #HappyState will internally change to SadState

    print()

    # Simulate actions in the new SadState
    dog.bark()
    dog.wag_tail()