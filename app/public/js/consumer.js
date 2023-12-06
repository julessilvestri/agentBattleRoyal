const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const Kafka = require('node-rdkafka');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const consumer = new Kafka.KafkaConsumer({
  'group.id': 'js-consumer',
  'metadata.broker.list': ['pkc-6ojv2.us-west4.gcp.confluent.cloud:9092'],
});

consumer.on('ready', () => {
  console.log('Le consommateur est prêt à s\'abonner aux sujets');
  consumer.subscribe(['topicKafka']);
  consumer.consume();
});

consumer.on('data', (message) => {
  const payload = message.value.toString();
  console.log(`Message reçu de Kafka: ${payload}`);
  io.emit('message', payload);
});

consumer.connect();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});