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
        "cid": "Jules",
        "team": "team1",
        "life": 15,
        "strength": 25,
        "armor": 30,
        "speed": 15
    },
    {
        "cid": "Ahmed",
        "team": "team2",
        "life": 10,
        "strength": 5,
        "armor": 3,
        "speed": 17
    },
    {
        "cid": "Anis",
        "team": "team3",
        "life": 10,
        "strength": 5,
        "armor": 3,
        "speed": 17
    }
]

for character in characterData :
    makeRequest("http://127.0.0.1:5000/character/join", character)

actionData = [
    {
        "cid": "Jules",
        "action": "ACTION.HIT",
        "target": "Ahmed"
    }
]

for action in actionData :
    makeRequest("http://127.0.0.1:5000/character/action/", action)

