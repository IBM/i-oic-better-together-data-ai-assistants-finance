
# Use the following command to pull the MongoDB image from a container registry:
podman pull docker.io/library/mongo:latest

# To retain data even if the container is stopped or deleted, map a local directory to MongoDB’s /data/db directory:
mkdir -p ~/mongodb_data

# Start the MongoDB container with Podman, mapping the local storage directory:
#	•	-d: Run the container in detached mode.
#	•	--name mongodb-container: Name the container mongodb-container.
#	•	-p 27017:27017: Map the container’s MongoDB port to your local machine’s port 27017.
#	•	-v ~/mongodb_data:/data/db:z: Mount the local directory ~/mongodb_data to /data/db in the container for data persistence.
#	•	-e MONGO_INITDB_ROOT_USERNAME and -e MONGO_INITDB_ROOT_PASSWORD: Set the root username and password for MongoDB.
podman run -d \
    --name mongodb-container \
    -p 27017:27017 \
    -v ~/mongodb_data:/data/db:z \
    -e MONGO_INITDB_ROOT_USERNAME=admin \
    -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
    mongo:latest

# Check the container’s status:
# podman ps

# To restart the container#
# podman start mongodb-container

# Removing the Container
# podman rm -f mongodb-container
