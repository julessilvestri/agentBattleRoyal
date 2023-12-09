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

actionData = [
    {
        "cid": "Zeus",
        "action": 0,
        "target": "Athena"
    },
    {
        "cid": "Athena",
        "action": 0,
        "target": "Zeus"
    }
]

for action in actionData :
    makeRequest("http://127.0.0.1:5000/character/action/", action)

