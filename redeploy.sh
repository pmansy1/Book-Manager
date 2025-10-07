#!/bin/bash

echo "🚀 Rebuilding and redeploying your application..."

# Build and push the Spring Boot backend
echo "📦 Building Spring Boot backend..."
cd spring-app
mvn clean package -DskipTests
cd ..

# Build the Docker image for Spring Boot
echo "🐳 Building Spring Boot Docker image..."
docker build -t pmansy1/spring-microservice:2.0.1 .

# Build the Docker image for React frontend
echo "🐳 Building React frontend Docker image..."
cd frontend
docker build -t pmansy1/react-frontend:1.0.1 .
cd ..

# Push images to DockerHub (make sure you're logged in)
echo "📤 Pushing images to DockerHub..."
docker push pmansy1/spring-microservice:2.0.1
docker push pmansy1/react-frontend:1.0.1

# Update Kubernetes deployments with new image versions
echo "☸️  Updating Kubernetes deployments..."
kubectl set image deployment/spring-deployment spring-microservice=pmansy1/spring-microservice:2.0.1
kubectl set image deployment/react-deployment react-ui=pmansy1/react-frontend:1.0.1

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/spring-deployment
kubectl wait --for=condition=available --timeout=300s deployment/react-deployment

echo "✅ Deployment complete!"
echo "🔍 Check your services:"
kubectl get services
echo ""
echo "🌐 Get the NodePort for your frontend:"
kubectl get service react-service
