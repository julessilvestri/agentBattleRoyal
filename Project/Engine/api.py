import flask
from flask import request, jsonify, redirect, url_for
import sys
from engine import *
from character import *

app = flask.Flask(__name__)
app.config["DEBUG"] = True

@app.route('/', methods=['GET'])
def home():
    return "Home"

# -----=====|| POST METHOD ||=====-----

# - POST - ajouter un personnage à une arène - 
#         /character/join/ - cid, teamid, life, strength, armor, speed
# Executer le script requests.py pour les méthodes POST 
@app.route('/character/join', methods=['POST'])
def addCharacterToArena():
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
    return "Personnage ajouté à l'arène avec succès"

# - POST - ajouter une action à un personnage
#         /character/action/ - cid, action, target
@app.route('/character/action/', methods=['POST'])
def addActionToPlayer():
    try:
        # Récupérer les données JSON de la requête
        action_data = request.get_json()

        # Extraire les informations de l'action
        cid = action_data.get("cid")
        action = action_data.get("action")
        target = action_data.get("target")

        # Trouver le joueur correspondant dans l'arène
        player = next((p for p in arena._playersList if p._id == cid), None)

        # Vérifier si le joueur a été trouvé
        if player:
            # Attribuer l'action et la cible au joueur
            print(player)
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
    playerList = [player.toDict() for player in arena._playersList]
    player = next((p for p in playerList if p["cid"] == cid), None)
    if player:
        return jsonify(player)
    else:
        return jsonify({"message": "Joueur non trouvé"}), 404

# - GET - récupérer les personnages d'une arène -
#         /characters/
# Exemple requete = http://127.0.0.1:5000/characters/
@app.route('/characters/', methods=['GET'])
def getAllPlayer():
    playerList = [player.toDict() for player in arena._playersList]
    return jsonify(playerList)

# - GET - récupérer les résultats des matchs
#         /status/ - round
# Exemple requete = http://127.0.0.1:5000/status/-1 => Donne les infos sur tous les rounds
# Exemple requete = http://127.0.0.1:5000/status/5 => Donne les infos sur le round 5
@app.route('/status/<round>', methods=['GET'])
def getStatusArena(round):
    engine = Engine()
    print(engine.getState())
    return engine.getState()

if __name__ == "__main__" :
    engine = Engine()
    arena = Arena(engine._arena)
    app.run()
    engine.run()