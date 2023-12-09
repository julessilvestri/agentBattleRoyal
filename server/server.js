const express = require('express');
const http = require('http');
const { Kafka } = require('kafkajs');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const kafka = new Kafka({
    clientId: "js-producer",
    brokers: ["pkc-6ojv2.us-west4.gcp.confluent.cloud:9092"],
    ssl: true,
    sasl: {
        mechanism: 'plain',
        username: 'OTFXQVNQUQFNWH7Y',
        password: 'GatCY3bVG00RmG7zo9AHcTo715mpiP0fvrPy3Woa7ZhKvtBnn6eJPY8j8vpGipAV',
    },
});

const consumer = kafka.consumer({ groupId: "js-consumer" });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "topicKafka", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value.toString();
            console.log('Message reçu :', value);
            console.log('Topic:', topic);
            console.log('Partition:', partition);
            console.log('Offset:', message.offset);
        
            io.emit('message', { value });
        },        
    });
};

run().catch(console.error);

app.use(express.static('app'));

io.on('connection', (socket) => {
  console.log('Un client s\'est connecté');
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
