#FROM openjdk:17-jdk-alpine
#COPY target/microMapBack-0.0.1-SNAPSHOT.jar app.jar
#ENV NEO4J_URI=bolt://localhost:7687
#ENV NEO4J_USER=neo4j
#
#ENV NEO4J_PASS=12345678
#ENV PORT=8081
#ENV FRONTEND=http://localhost:4200
#ENV KEYCLOAK_URL=http://localhost:8080
#ENV KEYCLOAK_REALM=app-micro
#EXPOSE $PORT
#
#
#ENTRYPOINT ["java","-jar","app.jar"]

#kinda worked-----------------------------------------------------------
#FROM openjdk:17-jdk-alpine
#
## Copy the JAR file into the container
#COPY target/microVisual-0.0.1-SNAPSHOT.jar app.jar
#
## Set environment variables
#ENV NEO4J_URI=bolt://localhost:7687
#ENV NEO4J_USER=neo4j
#ENV NEO4J_PASS=12345678
#ENV PORT=8081
#ENV FRONTEND=http://localhost:4200
#ENV KEYCLOAK_URL=http://localhost:8080
#ENV KEYCLOAK_REALM=app-micro
#
## Expose the application's port
#EXPOSE $PORT
#
## Run the application
#ENTRYPOINT ["java", "-jar", "app.jar"]

#new one ----------------------------------------------------
# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-alpine

# Copy the JAR file into the container
COPY target/microVisual-0.0.1-SNAPSHOT.jar /app/app.jar

# Set environment variables
ENV NEO4J_URI=bolt://neo4j:7687 \
    NEO4J_USER=neo4j \
    NEO4J_PASS=12345678 \
    PORT=8081 \
    FRONTEND=http://frontend:4200 \
    KEYCLOAK_URL=http://keycloak:8080 \
    KEYCLOAK_REALM=app-micro

# Expose the application's port
EXPOSE $PORT

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

