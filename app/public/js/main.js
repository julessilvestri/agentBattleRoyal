$(document).ready(function () {
    const characterList = $('#character-list');
    const characterDetails = $('#character-details');
    const healthChartCanvas = $('#health-chart');

    $.ajax({
        url: 'http://127.0.0.1:5000/characters/',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // Créer un tableau de noms de personnages et de points de vie
            const characterNames = data.map(character => character.cid);
            const characterHealth = data.map(character => character.life);

            // Créer le graphique à barres
            const healthChart = new Chart(healthChartCanvas, {
                type: 'bar',
                data: {
                    labels: characterNames,
                    datasets: [{
                        label: 'Points de vie',
                        data: characterHealth,
                        backgroundColor: 'rgba(255, 112, 17, 0.7)',
                        borderColor: 'rgba(255, 255, 255, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.5)'
                            }
                        },
                        y: {
                            max: 20,
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.5)'
                            }
                        }
                    }
                }
            });
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });

    $.ajax({
        url: 'http://127.0.0.1:5000/characters/',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                const character = {
                    name: data[i].cid,
                    team: data[i].teamid,
                    life: data[i].life,
                    strength: data[i].strength,
                    armor: data[i].armor,
                    speed: data[i].speed,
                    target: data[i].target,
                };

                const characterLink = $('<a href="#">' + character.name + '</a>');
                characterLink.click(function (event) {
                    event.preventDefault();
                    displayCharacterDetails(character);
                });

                characterList.append(characterLink);
            }
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });

    function displayCharacterDetails(character) {
        const detailsHTML = `
            <div id="character-chart">
                <canvas id="radar-chart-${character.name}" width="50px" height="50px"></canvas>
            </div>
            <div id="character-chart-settings">
                <h3>Circle view</h3>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider round" id="toggleButton"></span>
                </label>
            </div>
            <div id="character-item"><p>Nom : ${character.name}</p>
            <p>Equipe : ${character.team}</p>
            <p>Points de vie : ${character.life}</p>
            <p>Force : ${character.strength}</p>
            <p>Armure : ${character.armor}</p>
            <p>Vitesse : ${character.speed}</p>
            <p>Cible : ${character.target}</p></div>`;

        characterDetails.html(detailsHTML);

        // Créer un tableau de caractéristiques pour le graphique radar
        const radarLabels = ['Life', 'Armor', 'Speed', 'Strength'];
        const radarData = [character.life, character.armor, character.speed, character.strength];
        // Créer le graphique radar
        const radarChartCanvas = $(`#radar-chart-${character.name}`);
        radarChartCanvas.attr('width', 50); // ou une autre valeur selon vos besoins
        radarChartCanvas.attr('height', 50); // ou une autre valeur selon vos besoins
        const radarChart = new Chart(radarChartCanvas, {
            type: 'radar',
            data: {
                labels: radarLabels,
                datasets: [{
                    label: 'Caractéristiques',
                    data: radarData,
                    backgroundColor: 'rgba(255, 112, 17, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 20,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.5)',
                            circular: false
                        }
                    }
                }
            }
        });
        // Récupérer le bouton par son ID
        const toggleButton = document.getElementById('toggleButton');

        // Ajouter un écouteur d'événements pour le clic sur le bouton
        toggleButton.addEventListener('click', function () {
            
            // Inverser la valeur de circular entre true et false
            const currentCircularValue = radarChart.options.scales.r.grid.circular;
            radarChart.options.scales.r.grid.circular = !currentCircularValue;
            
            console.log("toggle");
            // Mettre à jour le graphique
            radarChart.update();
            
        });
    }
});