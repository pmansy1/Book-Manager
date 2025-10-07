# --- STAGE 1: BUILD PHASE ---
FROM maven:3-openjdk-17 AS build
WORKDIR /app
# Copy the Maven project definition (pom.xml)
COPY pom.xml .

# Copy the entire source tree using the actual path shown in your project structure
COPY spring-app/main /app/src/main 

# We now have to run the packaging process
RUN mvn clean package -DskipTests

# --- STAGE 2: RUNTIME PHASE ---
FROM openjdk:17-jdk-slim
EXPOSE 8080
ARG JAR_FILE=/app/target/*.jar
COPY --from=build ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
