$(document).ready(function(){
    $.ajax({
        url: 'http://127.0.0.1:5000/characters/',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            // La variable 'data' contient la réponse du serveur

            // Vous pouvez traiter les données ici
            // Par exemple, afficher les caractéristiques de chaque personnage
            for (var i = 0; i < data.length; i++) {
                var characterInfo = 'Character ID: ' + data[i].cid + '<br>' +
                                    'Life: ' + data[i].life + '<br>' +
                                    'Armor: ' + data[i].armor + '<br>' +
                                    'Speed: ' + data[i].speed + '<br>' +
                                    'Strength: ' + data[i].strength + '<br>' +
                                    'Team ID: ' + data[i].teamid + '<br>' +
                                    'Target: ' + data[i].target + '<br>' +
                                    '----------------------<br>';

                // Ajouter les informations du personnage à la div avec l'id 'characterResults'
                $('#characterResults').append(characterInfo);
            }
        },
        error: function(error) {
            console.log('Error:', error);
        }
    });
});