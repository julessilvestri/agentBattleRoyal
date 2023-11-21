import requests

def makeRequest(url, data):
    try:
        # Envoi de la requête POST avec les données JSON
        response = requests.post(url, json=data)

        # Affichage de la réponse du serveur
        print("Statut de la requête:", response.status_code)
        print("Réponse du serveur:", response.text)

    except requests.exceptions.ConnectionError as e:
        print(f"Erreur de connexion : {e}")

characterData = [
    {
        "cid": "Zeus",
        "team": "team1",
        "life": 5,
        "strength": 3,
        "armor": 7,
        "speed": 5
    },
    {
        "cid": "Athéna",
        "team": "team2",
        "life": 3,
        "strength": 6,
        "armor": 7,
        "speed": 4
    },
    {
        "cid": "Poséidon",
        "team": "team3",
        "life": 4,
        "strength": 5,
        "armor": 1,
        "speed": 10
    }
]

for character in characterData :
    makeRequest("http://127.0.0.1:5000/character/join", character)

actionData = [
    {
        "cid": "Zeus",
        "action": "ACTION.HIT",
        "target": "Poséidon"
    }
]

for action in actionData :
    makeRequest("http://127.0.0.1:5000/character/action/", action)

