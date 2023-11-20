import flask
from flask import request, jsonify, redirect, url_for
import sys
from engine import *
from character import *
from requests import *

app = flask.Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return "Home"

# -----=====|| POST METHOD ||=====-----

# - POST - ajouter un personnage à une arène - 
#         /character/join/ - cid, teamid, life, strength, armor, speed
# Executer le script requests.py pour les méthodes POST 
@app.route('/character/join', methods=['POST'])
def addCharacterToArena():
    try:
        # Initialiser les players avec les données JSON de la requête
        characterData = request.get_json()
        
        newPlayer = CharacterProxy(
            characterData["cid"],
            characterData["team"],
            characterData["life"],
            characterData["strength"],
            characterData["armor"],
            characterData["speed"]
        )
        # Ajouter les players
        arena.addPlayer(newPlayer)
        return f"{characterData['cid']} ajouté à l'arène avec succès"
    except Exception as e:
        return f"Erreur interne du serveur : {str(e)}", 500
    
# - POST - ajouter une action à un personnage
#         /character/action/ - cid, action, target
@app.route('/character/action/', methods=['POST'])
def addActionToPlayer():
    try:
        # Récupérer les données JSON de la requête
        actionData = request.get_json()

        # Extraire les informations de l'action
        cid = actionData.get("cid")
        action = actionData.get("action")
        target = actionData.get("target")

        # Trouver le joueur correspondant dans l'arène
        player = next((p for p in arena._playersList if p._id == cid), None)

        # Vérifier si le joueur a été trouvé
        if player:
            # Attribuer l'action et la cible au joueur
            player.setAction(action)
            player.setTarget(target)
            return "Les actions des personnages ont été attribuées"
    except Exception as e:
        return f"Erreur interne du serveur : {str(e)}", 500

# -------------------------------------


# -----=====|| GET METHOD ||=====-----

# - GET - récupérer un personnage - 
#         /character/ - cid
# Exemple requete = http://127.0.0.1:5000/character/Jules
@app.route('/character/<cid>', methods=['GET'])
def getPlayerById(cid):
    try:
        playerList = [player.toDict() for player in arena._playersList]
        player = next((p for p in playerList if p["cid"] == cid), None)
        if player:
            return jsonify(player)
        else:
            return jsonify({"message": "Joueur non trouvé"}), 404
    except Exception as e:
        return f"Erreur interne du serveur : {str(e)}", 500

# - GET - récupérer les personnages d'une arène -
#         /characters/
# Exemple requete = http://127.0.0.1:5000/characters/
@app.route('/characters/', methods=['GET'])
def getAllPlayer():
    try:
        playerList = [player.toDict() for player in arena._playersList]
        return jsonify(playerList)
    except Exception as e:
            return f"Erreur interne du serveur : {str(e)}", 500

# - GET - récupérer les résultats des matchs
#         /status/ - round
# Exemple requete = http://127.0.0.1:5000/status/-1 => Donne les infos sur tous les rounds
# Exemple requete = http://127.0.0.1:5000/status/5 => Donne les infos sur le round 5
@app.route('/status/<round>', methods=['GET'])
def getStatusArena(round):
    try:
        return engine.getState()
    except Exception as e:
            return f"Erreur interne du serveur : {str(e)}", 500

if __name__ == "__main__" :
    engine = Engine()
    arena = Arena(engine._arena)

    app.run(debug=False)

    requestApi = Requests()
    threadEngine = threading.Thread(target=engine.run())
    threadRequest = threading.Thread(target = Requests.run())