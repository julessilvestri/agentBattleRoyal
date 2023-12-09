const socket = io();

var requestURL = "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json";

var request = new XMLHttpRequest();
request.open("GET", requestURL);
request.responseType = "json";
request.send();

socket.on('message', (data) => {
    const messagesElement = document.getElementById('messages');
    messagesElement.textContent = data.value;
});