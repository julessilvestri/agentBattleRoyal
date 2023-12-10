const socket = io();

var requestURL = "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json";

var request = new XMLHttpRequest();
request.open("GET", requestURL);
request.responseType = "json";
request.send();

let characterList = []
let characterLifeList = []
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

socket.on('message', (data) => {
    try {
        characterList = []
        characterLifeList = []

        var objetJSON = JSON.parse(data.value);
        console.log(objetJSON);

        if (objetJSON.damage != undefined) {
            var damageList = objetJSON.damage
            console.log(damageList)
        }
        if (objetJSON.death != undefined) {
            var deathList = objetJSON.death
            console.log(deathList)
        }
        if (objetJSON.enter_arena != undefined) {
            var enterArenaList = objetJSON.enter_arena

            enterArenaList.forEach(character => {
                characterList.push(character[1].cid);
                characterLifeList.push(character[1].life);
            });

            console.log(characterLifeList);

            rewardsChart.data.labels = characterList;
            rewardsChart.data.datasets[0].data = characterLifeList;
            rewardsChart.update();

        }
        if (objetJSON.gold != undefined) {
            var goldList = objetJSON.gold
            console.log(goldList)
        }
        if (objetJSON.set_action != undefined) {
            var setActionList = objetJSON.set_action
            console.log(setActionList)
        }
        if (objetJSON.set_target != undefined) {
            var setTargetList = objetJSON.set_target
            console.log(setTargetList)
        }
        if (objetJSON.start_game != undefined) {
            var startGameList = objetJSON.start_game
            console.log(startGameList)
        }
        if (objetJSON.turn_id != undefined) {
            var turnIdList = objetJSON.turn_id
            console.log(turnIdList)
        }

        var characters = characterList; // Remplacez par les noms de vos personnages

        if (objetJSON.gold != undefined) {
            var goldListArray = objetJSON.gold;

            // Mettez à jour goldList avec les nouvelles valeurs
            goldListArray.forEach(([timestamp, values]) => {
                Object.entries(values).forEach(([character, gold]) => {
                    goldList[character] = gold;
                });
            });

            // Trier les personnages en fonction de leur or
            characters.sort(function(a, b) {
                return goldList[b] - goldList[a];
            });

            // Mettre à jour le classement dans le HTML
            var rankingList = document.getElementById('ranking-list');
            rankingList.innerHTML = ''; // Efface le contenu précédent

            characters.forEach(function (character) {
                var listItem = document.createElement('li');
                listItem.textContent = character + ' - Gold: ' + goldList[character];
                rankingList.appendChild(listItem);
            });
        }

                //LOG RES ACTIONS
        var logList = document.getElementById('log-list');

        // Vérifiez si l'événement 'damage' existe dans la réponse JSON
        if (objetJSON.damage !== undefined && objetJSON.damage.length > 0) {
            // Obtenez le numéro du tour à partir du premier élément de 'turn_id'
            var tourId = objetJSON.turn_id[0][1];

            // Parcourez chaque événement 'damage' et ajoutez un message au log
            objetJSON.damage.forEach(function (damageEvent) {
                var timestamp = damageEvent[0];
                var damageData = damageEvent[1];

                // Construisez le message en fonction des données de dégâts et du numéro du tour
                var message = "Tour " + tourId + ": " + damageData.character + " fait " + damageData.damage + " dégât(s) à " + damageData.target;

                // Créez un élément de liste pour chaque message
                var listItem = document.createElement('li');
                listItem.textContent = message;

                // Ajoutez l'élément de liste au log
                logList.appendChild(listItem);
            });
        } else {
            // Si aucun événement 'damage', ajoutez un message spécial au log
            var listItem = document.createElement('li');
            listItem.textContent = 'Aucun dégât à rapporter';

            logList.appendChild(listItem);
        }

        combatLog.forEach(function (action) {
            var listItem = document.createElement('li');
            listItem.textContent = action;
            logList.appendChild(listItem);
        });
    } catch (erreur) {
        console.error("Erreur lors de l'analyse JSON : ", erreur.message);
    }
});