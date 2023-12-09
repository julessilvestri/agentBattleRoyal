from confluent_kafka import Producer
import json

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

with open('../Engine/data.json') as f:
    json_content = json.load(f)

message_value = json.dumps(json_content)

producer.produce(topic, key=message_key, value=message_value)
producer.flush()
