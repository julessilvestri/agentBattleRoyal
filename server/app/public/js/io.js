const socket = io();

var requestURL = "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json";

var request = new XMLHttpRequest();
request.open("GET", requestURL);
request.responseType = "json";
request.send();

let characterList = []
let characterLifeList = []

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

        var rankingList = document.getElementById('ranking-list');
        var characters = characterList; // Remplacez par les noms de vos personnages

        characters.forEach(function (character) {
            var listItem = document.createElement('li');
            listItem.textContent = character;
            rankingList.appendChild(listItem);
        });

        // Exemple de mise à jour du log de combat
        var logList = document.getElementById('log-list');
        var combatLog = ['Personnage 1 frappe Personnage 2', 'Personnage 3 esquive']; // Remplacez par les actions réelles du combat

        combatLog.forEach(function (action) {
            var listItem = document.createElement('li');
            listItem.textContent = action;
            logList.appendChild(listItem);
        });
    } catch (erreur) {
        console.error("Erreur lors de l'analyse JSON : ", erreur.message);
    }
});