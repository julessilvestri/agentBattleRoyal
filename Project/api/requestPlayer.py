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
        "cid": "Athéna",
        "team": "team2",
        "life": 3,
        "strength": 0,
        "armor": 7,
        "speed": 4
    }
    # ,
    # {
    #     "cid": "Poséidon",
    #     "team": "team3",
    #     "life": 4,
    #     "strength": 5,
    #     "armor": 1,
    #     "speed": 10
    # },
    # {
    #     "cid": "Héra",
    #     "team": "team3",
    #     "life": 2,
    #     "strength": 7,
    #     "armor": 3,
    #     "speed": 8
    # },
    # {
    #     "cid": "Apollon",
    #     "team": "team3",
    #     "life": 14,
    #     "strength": 1,
    #     "armor": 1,
    #     "speed": 4
    # },
    # {
    #     "cid": "Artémis",
    #     "team": "team3",
    #     "life": 2,
    #     "strength": 2,
    #     "armor": 14,
    #     "speed": 2
    # }
]

for character in characterData :
    makeRequest("http://127.0.0.1:5000/character/join", character)


