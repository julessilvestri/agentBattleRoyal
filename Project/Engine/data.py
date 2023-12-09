import time
import json
from confluent_kafka import Producer
import json

class Data:
    def __init__(self):
        self._history = {}
        self._filename = "data.json"

    def addData(self, key, value):
        if not key in self._history:
            self._history[key] = []    
        self._history[key].append((time.time(), value))

    def save(self):
        f = open(self._filename, "w")
        toWrite = json.dumps(self._history)
        f.write(toWrite)
        f.close()

        conf_cloud = {
            'bootstrap.servers': 'pkc-6ojv2.us-west4.gcp.confluent.cloud:9092',
            'sasl.mechanism': 'PLAIN',
            'sasl.username': 'OTFXQVNQUQFNWH7Y',
            'sasl.password': 'GatCY3bVG00RmG7zo9AHcTo715mpiP0fvrPy3Woa7ZhKvtBnn6eJPY8j8vpGipAV',
            'security.protocol': 'SASL_SSL',
            'client.id': 'python-producer'
        }

        producer = Producer(conf_cloud)

        topic = 'topicKafka'
        message_key = 'key'

        with open('data.json') as f:
            json_content = json.load(f)

        message_value = json.dumps(json_content)

        producer.produce(topic, key=message_key, value=message_value)
        producer.flush()

    def getHistory(self):
        return self._history
