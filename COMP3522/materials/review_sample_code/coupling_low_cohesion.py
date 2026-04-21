"""
This code shows low cohesion and high coupling
GameManager and Screen classes have too many responsibilities spread out over both classes (low cohesion)
This results in bidirectional method calls in each class (high coupling)
"""

#Low cohesion.
#Game manager handles game flow, saving, loading, and character creation
class GameManager:
    def __init__(self, screen = None):
        self._screen = screen

    def start(self):
        print("Starting game")
        self._screen.open()

    def start_create_character(self):
        print("Start creating character")
        self._screen.create_character()

    def save(self):
        print("Saving")

    def load(self):
        print("Loading")

#Low cohesion.
#Screen handles opening and closing screens and some character creation
class Screen:
    def __init__(self, game_manager = None):
        self._game_manager = game_manager

    def open(self):
        print("Opening screen")
        self._game_manager.load()

    def close(self):
        print("Closing screen")
        self._game_manager.save()

    def create_character(self):
        print("Creating character")
        self._game_manager.save()

#instantiate objects
game_manager = GameManager()
screen = Screen(game_manager) #inject game manager to screen
game_manager._screen = screen #link screen to game manager

#this section acts as a UI. User presses start button, then start create character
game_manager.start()
game_manager.start_create_character()