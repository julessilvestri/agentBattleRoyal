from flask import Flask
from character import *
from engine import *
import threading
import time

app = Flask(__name__)
engine = Engine()
data = Data()

def run_game():
    # # Instance des players 
    # player1 = CharacterProxy("Jules", "team1", 10, 20, 20, 10)
    # player2 = CharacterProxy("Ahmed", "team2", 20, 10, 20, 10)

    # # Ajout des players dans l'arene
    # engine.addPlayer(player1)
    # engine.addPlayer(player2)

    # # Définition de l'action du player1 (frapper)
    # player1.setAction(ACTION.HIT)
    # # Définition du joueur cible de l'action (cible à definir pour les certaines actions)
    # player1.setTarget(player2.getId())

    # # Définition de l'action du player2 (frapper)
    # player2.setAction(ACTION.HIT)
    # # Définition du joueur cible de l'action (cible à definir pour les certaines actions)
    # player2.setTarget(player1.getId())

    # Le moteur sera pret pour demarrer, lorsque : 
    #     - 2 joueurs ou + sont présents dans l'arène
    #     - Tous les joueurs ont chacun une action initialisé

    while not engine.isReadyToStart():
        time.sleep(1)
        
    try:
        # lancement de un tour d'arene 
        engine.run()

        # Affichage des différents play
        # print(player1)
        # print(player2)

        # print ("-----")
        # print(engine.isRunning()) # Verifie si le moteur du jeu en fonctionnement
        # print ("-----")

        # # Affichage des infos de l'arene
        # print(engine.getState())

    except Exception as e:
        print(str(e))

run_game()