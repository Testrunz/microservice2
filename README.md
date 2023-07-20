Testrunz Microservice
rabbitmqctl purge_queue 
rabbitmqctl list_queues

docker run -d -p 27017:27017 -v /Users/hemapriya/Desktop/microservice/mongodb-data:/data/db --name mongodb mongo

docker run -d --name influxdb --restart=always -p 8086:8086 -v D:\testing\microservice-testrunz-server\influxdb2:/var/lib/influxdb2 -e DOCKER_INFLUXDB_INIT_MODE=setup -e DOCKER_INFLUXDB_INIT_USERNAME=admin -e DOCKER_INFLUXDB_INIT_PASSWORD=admin123 -e DOCKER_INFLUXDB_INIT_ORG=my-org -e DOCKER_INFLUXDB_INIT_BUCKET=my-bucket -e DOCKER_INFLUXDB_INIT_RETENTION=24h -e DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=YOUR_ADMIN_TOKEN influxdb:2.0
