from confluent_kafka import Producer

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
message_key = 'cle_du_message'
message_value = 'Contenu du message'

producer.produce(topic, key=message_key, value=message_value)
producer.flush()
print("fin")