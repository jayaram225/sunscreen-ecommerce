# Use Java base image
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build project
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Run application
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]