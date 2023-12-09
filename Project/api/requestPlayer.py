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
        "strength": 1,
        "armor": 7,
        "speed": 5
    },
    {
        "cid": "Athena",
        "team": "team2",
        "life": 3,
        "strength": 0,
        "armor": 7,
        "speed": 4
    }

]

for character in characterData :
    makeRequest("http://127.0.0.1:5000/character/join", character)


