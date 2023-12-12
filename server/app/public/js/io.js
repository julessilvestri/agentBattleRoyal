const socket = io();

let characterList = [];
let characterLifeList = [];
let goldList = {};

var ctx = document.getElementById('rewards-chart').getContext('2d');
var rewardsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: characterList,
        datasets: [{
            label: 'Life',
            data: characterLifeList,
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 205, 86, 0.7)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 205, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function updateLifeChart(characterList, lifeList) {
    rewardsChart.data.labels = characterList;
    rewardsChart.data.datasets[0].data = lifeList;
    rewardsChart.update();
}

function calculateCurrentLife(enterArenaData, setTargetLogs) {
    const currentLife = {};

    // Initialise les points de vie max pour chaque personnage
    enterArenaData.forEach(entry => {
        const characterId = entry[1].cid;
        const maxLife = entry[1].life;
        currentLife[characterId] = {
            life: maxLife,
            action: "None",
            target: null,
            dead: false
        };
    });

    // Parcourez les logs de set_target pour mettre à jour les points de vie et autres informations
    setTargetLogs.forEach(targetLog => {
        const timestamp = targetLog[0];
        const targetData = targetLog[1];

        const targetId = targetData.cid;
        const damage = targetData.damage;

        // Met à jour les points de vie du personnage cible
        if (currentLife[targetId] !== undefined) {
            if (targetData.action !== undefined && targetData.action !== null) {
                // Utilise la valeur réelle de l'action si elle est spécifiée
                currentLife[targetId].action = targetData.action;
            } else {
                // Sinon, utilise "None" comme valeur par défaut
                currentLife[targetId].action = "None";
            }

            if (targetData.action === 0) {
                // C'est une attaque, enlevez des points de vie
                currentLife[targetId].life -= damage;

                // Assurez-vous que les points de vie ne deviennent pas négatifs
                if (currentLife[targetId].life < 0) {
                    currentLife[targetId].life = 0;
                }
            }

            // Mettez à jour d'autres informations telles que la cible et le statut "dead"
            currentLife[targetId].target = targetData.target;
            currentLife[targetId].dead = targetData.dead;
        } else {
            console.error("Erreur : Aucun personnage trouvé avec l'ID", targetId);
        }
    });

    console.log(currentLife);
    return currentLife;
}

socket.on('message', (data) => {
    try {
        var objetJSON = JSON.parse(data.value);

        if (objetJSON.enter_arena !== undefined && objetJSON.set_target !== undefined) {
            const enterArenaData = objetJSON.enter_arena;
            const setTargetLogs = objetJSON.set_target;

            // Calculer les points de vie actuels
            const currentLife = calculateCurrentLife(enterArenaData, setTargetLogs);

            // Faites ce que vous voulez avec les points de vie actuels
            console.log("currentLife");
            console.log(currentLife);

            // Mettre à jour le graphique avec la vie actuelle des personnages
            updateLifeChart(Object.keys(currentLife), currentLife.map(character => character.life));
        }

    } catch (erreur) {
        console.error("Erreur lors de l'analyse JSON : ", erreur.message);
    }
});
