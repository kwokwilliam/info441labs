docker rm -f customMongoContainer
docker rm -f rabbit 


docker run -d \
	-p 27017:27017 \
	--name customMongoContainer \
	mongo


docker run -d \
	--name rabbit \
	-p 5672:5672 \
	-p 15672:15672 \
	rabbitmq:3-management