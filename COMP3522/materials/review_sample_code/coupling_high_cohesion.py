"""
This code shows high cohesion and low coupling
Each class is focused on focused well-defined tasks (high cohesion)
As a result there fewer method calls between classes. No bidirectional method calls (low coupling)
"""

#Handles general game flow when certain actions occur
class GameManager:
    def __init__(self, screen, character_creator):
        self._screen = screen
        self._character_creator = character_creator

    def start(self):
        print("Starting game")
        self._screen.open()

    def start_create_character(self):
        print("Start creating character")
        self._character_creator.create_character()

#Handles saving and loading code
class SaveLoad:
    def save(self):
        print("Saving")

    def load(self):
        print("Loading")

#Handles Character creation logic, data is saved after character created
class CharacterCreator:
    def __init__(self, save_load = None):
        self._save_load = save_load

    def create_character(self):
        print("Creating character")
        self._save_load.save()

#Handles screen logic, data is loaded when screen opens, and saved when screen closes
class Screen:
    def __init__(self, save_load = None):
        self._save_load = save_load

    def open(self):
        print("Opening screen")
        self._save_load.load()

    def close(self):
        print("Closing screen")
        self._save_load.save()

#instantiate all objects. Inject save_load to objects that need them
save_load = SaveLoad()
screen = Screen(save_load)
character = CharacterCreator(save_load)

#pass necessary objects to game manager to handle flow
game_manager = GameManager(screen, character)

#this section acts as a UI. User presses start button, then start create character
game_manager.start()
game_manager.start_create_character()