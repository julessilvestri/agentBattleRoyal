import flask
from flask import request, jsonify, redirect, url_for
import sys
from engine import *
from character import *
import threading
import json
from flasgger import Swagger
from flask_cors import CORS

app = flask.Flask(__name__)
swagger = Swagger(app)
CORS(app)

engine = Engine()

if __name__ == "__main__":
  app.run()

threading.Thread(target=engine.run).start()

@app.route('/', methods=['GET'])
def home():
    return "Home"

# -----=====|| POST METHOD ||=====-----

# - POST - ajouter un personnage à une arène - 
#         /character/join/ - cid, teamid, life, strength, armor, speed
# Executer le script requests.py pour les méthodes POST 
@app.route('/character/join', methods=['POST'])
def addCharacterToArena():
    """
    Add a new character to the arena.

    ---
    tags:
      - POST
    parameters:
      - name: characterData
        in: body
        required: true
        schema:
          type: object
          properties:
            cid:
              type: string
              description: ID of the character
            team:
              type: string
              description: Team of the character
            life:
              type: integer
              description: Life points of the character
            strength:
              type: integer
              description: Strength of the character
            armor:
              type: integer
              description: Armor of the character
            speed:
              type: integer
              description: Speed of the character
    responses:
      200:
        description: Character added to the arena successfully
      500:
        description: Internal server error
    """
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
        engine.addPlayer(newPlayer)
        return f"{characterData['cid']} ajouté à l'arène avec succès"
    except Exception as e:
        return f"Erreur interne du serveur : {str(e)}", 500
    
# - POST - ajouter une action à un personnage
#         /character/action/ - cid, action, target
@app.route('/character/action/', methods=['POST'])
def addActionToPlayer():
    """
    Add an action to a character in the arena.

    ---
    tags:
      - POST
    parameters:
      - name: actionData
        in: body
        required: true
        schema:
          type: object
          properties:
            cid:
              type: string
              description: ID of the character
            action:
              type: string
              description: Action to be performed by the character
            target:
              type: string
              description: Target of the action
    responses:
      200:
        description: Action added to the character successfully
      500:
        description: Internal server error
    """
    try:
        # Récupérer les données JSON de la requête
        actionData = request.get_json()
        # Extraire les informations de l'action
        cid = actionData.get("cid")
        action = actionData.get("action")
        target = actionData.get("target")
        # Trouver le joueur correspondant dans l'arène
        # player = next((p for p in engine._arena._playersList if p._id == cid), None)
        engine.setActionTo(cid, action)
        engine.setTargetTo(cid, target)
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
    """
    Get player information by ID.

    ---
    tags:
      - GET
    parameters:
      - name: cid
        in: path
        type: string
        required: true
        description: ID of the player
    responses:
      200:
        description: Player information
      404:
        description: Player not found
    """
    try:
        playerList = [player.toDict() for player in engine._arena._playersList]
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
    """
    Get information for all players.

    ---
    tags:
      - GET
    responses:
      200:
        description: Information for all players
      500:
        description: Internal server error
    """
    try:
        playerList = [player.toDict() for player in engine._arena._playersList]
        return jsonify(playerList)
    except Exception as e:
            return f"Erreur interne du serveur : {str(e)}", 500

# - GET - récupérer les résultats des matchs
#         /status/ - round
# Exemple requete = http://127.0.0.1:5000/status/-1 => Donne les infos sur tous les rounds
# Exemple requete = http://127.0.0.1:5000/status/5 => Donne les infos sur le round 5
@app.route('/status/<round>', methods=['GET'])
def getStatusArena(round):
    """
    Get the status of the arena for a specific round.

    ---
    tags:
      - GET
    parameters:
      - name: round
        in: path
        type: string
        required: true
        description: The round for which to get the arena status
    responses:
      200:
        description: Arena status for the specified round
      500:
        description: Internal server error
    """
    try:
        return jsonify(engine.getState())
    except Exception as e:
            return f"Erreur interne du serveur : {str(e)}", 500
