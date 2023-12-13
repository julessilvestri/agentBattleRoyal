const socket = io();

let goldList = {}; // Pas besoin de déclarer characterList et characterLifeList ici

// Définir la fonction updateLifeChart en premier
function updateLifeChart(characterList, lifeList) {
    rewardsChart.data.labels = characterList;
    rewardsChart.data.datasets[0].data = lifeList;
    rewardsChart.update();
}

const ctx = document.getElementById('rewards-chart').getContext('2d');
const rewardsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [], // Pas besoin de définir characterList et characterLifeList ici
        datasets: [{
            label: 'Life',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 205, 86, 0.7)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 205, 86, 1)',
            ],
            borderWidth: 1,
        }],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    },
});

function calculateCurrentLife(enterArenaData, setTargetLogs, damageLogs) {
    const currentLife = {};

    // Initialise les points de vie max et la force pour chaque personnage
    enterArenaData.forEach(([characterName, characterData]) => {
        const characterId = characterData.cid;
        const maxLife = characterData.life;
        const strength = characterData.strength;

        currentLife[characterId] = {
            name: characterName,
            life: maxLife,
            action: "None",
            target: null,
            dead: false,
            strength: strength,
        };
    });

    setTargetLogs.forEach(([timestamp, targetData]) => {
        const targetId = targetData.cid; // Utilisez targetId au lieu de cid pour la cible
        const damage = targetData.damage;

        // Met à jour les points de vie du personnage cible
        if (currentLife[targetId] !== undefined) {
            // Utilise la valeur réelle de l'action si elle est spécifiée
            currentLife[targetId].action = targetData.action !== undefined ? targetData.action : "None";

            if (targetData.action === 0) {
                // C'est une attaque, enlevez des points de vie à la cible
                const targetId = targetData.target; // Stockez directement la référence du personnage cible
                currentLife[targetId].life -= damage;

                // Assurez-vous que les points de vie ne deviennent pas négatifs
                currentLife[targetId].life = Math.max(0, currentLife[targetId].life);
            }

            // Mettez à jour d'autres informations telles que la cible et le statut "dead"
            currentLife[targetId].target = targetData.target;
            currentLife[targetId].dead = targetData.dead;
        } else {
            console.error("Erreur : Aucun personnage trouvé avec l'ID", targetId);
        }
    });

    // Parcourez les logs de damage pour mettre à jour les points de vie après les attaques
    damageLogs.forEach(([timestamp, damageData]) => {
        const characterId = damageData.character;
        const damageReceived = damageData.damage;

        // Met à jour les points de vie du personnage cible
        if (currentLife[characterId] !== undefined) {
            currentLife[characterId].life -= damageReceived;

            // Assurez-vous que les points de vie ne deviennent pas négatifs
            currentLife[characterId].life = Math.max(0, currentLife[characterId].life);
        } else {
            console.error("Erreur : Aucun personnage trouvé avec l'ID", characterId);
        }
    });

    console.log(currentLife);
    return currentLife;
}

const tourNumberElement = document.getElementById('tour-number');

socket.on('message', (data) => {
    try {
        const objetJSON = JSON.parse(data.value);

        if (
            objetJSON.enter_arena !== undefined &&
            objetJSON.set_target !== undefined &&
            objetJSON.damage !== undefined
        ) {
            const enterArenaData = objetJSON.enter_arena;
            const setTargetLogs = objetJSON.set_target;
            const damageLogs = objetJSON.damage; // Check if the 'damage' field exists

            // Calculer les points de vie actuels
            const currentLife = calculateCurrentLife(enterArenaData, setTargetLogs, damageLogs);

            // Faites ce que vous voulez avec les points de vie actuels
            console.log("currentLife");
            console.log(currentLife);

            // Mettre à jour le graphique avec la vie actuelle des personnages
            updateLifeChart(Object.keys(currentLife), Object.values(currentLife).map(character => character.life));

            // Mettre à jour le classement en fonction de l'or
            const characters = Object.keys(currentLife);

            if (objetJSON.gold !== undefined) {
                const goldListArray = objetJSON.gold;

                // Mettez à jour goldList avec les nouvelles valeurs
                goldListArray.forEach(([timestamp, values]) => {
                    Object.entries(values).forEach(([character, gold]) => {
                        goldList[character] = gold;
                    });
                });

                // Trier les personnages en fonction de leur or
                characters.sort(function (a, b) {
                    return goldList[b] - goldList[a];
                });

                // Mettre à jour le classement dans le HTML
                const rankingList = document.getElementById('ranking-list');
                rankingList.innerHTML = ''; // Efface le contenu précédent

                characters.forEach(function (character) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${character} - Gold: ${goldList[character]}`;
                    rankingList.appendChild(listItem);
                });
            }

            // Mise à jour du numéro de tour dans l'élément HTML
            tourNumberElement.textContent = `Tour ${objetJSON.turn_id[objetJSON.turn_id.length - 1][1]}`;

            // Log messages for each character's action
            const logList = document.getElementById('log-list');
            logList.innerHTML = ''; // Clear existing messages

            setTargetLogs.forEach(targetLog => {
                const targetData = targetLog[1];
                const characterId = targetData.cid;

                let actionName;
                let damageMessage = '';
                let targetName = ''; // Ajout de cette ligne

                switch (parseInt(targetData.action, 10)) {
                    case 0:
                        actionName = "HIT";
                        damageMessage = targetData.damage !== undefined ? ` (Dégât : ${targetData.damage})` : "";

                        // Ajout de cette vérification pour afficher le nom de la cible
                        if (targetData.target !== undefined && currentLife[targetData.target] !== undefined) {
                            targetName = currentLife[targetData.target].name; // Assurez-vous que vous avez un champ 'name' dans vos données de personnage
                        }

                        break;
                    case 1:
                        actionName = "BLOCK";
                        damageMessage = targetData.damage !== undefined ? ` (Dégât : ${targetData.damage})` : "";
                        break;
                    case 2:
                        actionName = "DODGE";
                        break;
                    case 3:
                        actionName = "FLY";
                        break;
                    default:
                        actionName = "UNKNOWN";
                        console.log("Unknown action value:", targetData.action, typeof targetData.action);
                        break;
                }

                // Modifiez le message pour inclure le nom de la cible si disponible
                const message = `Tour ${objetJSON.turn_id[objetJSON.turn_id.length - 1][1]}: ${characterId} effectue l'action ${actionName}${targetName !== '' ? " sur " + targetName : ""}${damageMessage}`;

                const listItem = document.createElement('li');
                listItem.textContent = message;

                logList.appendChild(listItem);
            });
        }
    } catch (erreur) {
        console.error("Erreur lors de l'analyse JSON : ", erreur.message);
    }
});
