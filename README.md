# Full-Stack Book Manager Deployment: Spring Boot & React on Kubernetes

This document provides the definitive guide for building, containerizing, and deploying the Book Manager application (Spring Boot API + React UI) onto a local Kubernetes (K8s) cluster using Docker Desktop.

The successful deployment confirms full CRUD functionality via the frontend connecting to the backend via a K8s Service.

## 🚀 1. Prerequisites

You must have the following tools installed and configured:

- **Java 17 / Maven**
- **Node.js / npm**
- **Docker Desktop**: Running with Kubernetes enabled.
- **kubectl**: Kubernetes command-line tool.
- **Docker Hub Account**: Logged in locally to push images (Username: pmansy1).

## 🛠️ 2. Build and Push Containers

This stage creates the production-ready Docker images and pushes them to Docker Hub.

### A. Spring Microservice (Backend)

| Command                                               | Location               | Description                          |
| ----------------------------------------------------- | ---------------------- | ------------------------------------ |
| `docker build -t pmansy1/spring-microservice:2.0.1 .` | `my-spring-container/` | Builds the Spring application image. |
| `docker push pmansy1/spring-microservice:2.0.1`       | `my-spring-container/` | Pushes the image to Docker Hub.      |

### B. React Frontend (UI)

| Command                                          | Location    | Description                                                                |
| ------------------------------------------------ | ----------- | -------------------------------------------------------------------------- |
| `npm run build`                                  | `frontend/` | Compiles React source code (must be run before building the Docker image). |
| `docker build -t pmansy1/react-frontend:1.0.4 .` | `frontend/` | Builds the Nginx image containing the static UI files.                     |
| `docker push pmansy1/react-frontend:1.0.4`       | `frontend/` | Pushes the image to Docker Hub.                                            |

## 🌐 3. Deploy to Kubernetes

This deploys the applications with two replicas each, using the corrected ClusterIP configuration for the Spring service.

Navigate to the manifests directory:

```bash
cd k8s/
```

Apply all four Kubernetes Manifests:

```bash
kubectl apply -f .
```

## ✅ 4. Verification and Access

### A. Verify Deployment Status

Confirm that both deployments are fully running (Status: Running, Ready: 1/1 for all pods).

```bash
kubectl get all
```

### B. Access the React UI

Get the NodePort (External Port):

```bash
kubectl get service react-service
```

The output will show a port mapping (e.g., `80:30934/TCP`). Note the five-digit number (e.g., `30934`).

**Open the Application**: Navigate to the following URL in your web browser:

```
http://localhost:<NodePort>
```

### C. Set Up Backend Access (Port Forwarding)

For the frontend to connect to the backend, set up port forwarding:

```bash
kubectl port-forward service/book-api-service 8080:8080
```

Keep this terminal session running while using the application.

## 🧪 5. Testing the CRUD Operations

Verify all functionalities are working via the React UI:

| Operation           | Test Action                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| **CREATE (POST)**   | Add a new book; confirm entry appears with an auto-generated ID.                      |
| **READ (GET)**      | Confirm all existing data is displayed and accessible.                                |
| **UPDATE (PUT)**    | Click Update, change the book title, and confirm the change is reflected immediately. |
| **DELETE (DELETE)** | Click Delete next to an item; confirm it is permanently removed.                      |
| **Persistence**     | Refresh the browser page; confirm all changes remain intact.                          |

## 🗑️ 6. Clean Up

To remove all deployed resources and free up ports on your local cluster:

| Command                  | Description                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `kubectl delete -f k8s/` | Deletes all Deployments, ReplicaSets, Pods, and Services defined in the k8s/ directory. |
| `docker system prune -a` | (Optional) Clears local cache of unused Docker images and build artifacts.              |

## 📋 Additional Notes

- **CORS Configuration**: The Spring Boot backend includes CORS configuration to allow cross-origin requests from the React frontend.
- **Service Communication**: The frontend communicates with the backend using the Kubernetes service name `book-api-service:8080` internally, and `localhost:8080` via port forwarding for external access.
- **Image Versions**: The current deployment uses:
  - Spring Backend: `pmansy1/spring-microservice:2.0.1`
  - React Frontend: `pmansy1/react-frontend:1.0.4`

## 🔧 Troubleshooting

If you encounter issues:

1. **Frontend not loading**: Check that the NodePort service is running and accessible
2. **Backend connection errors**: Ensure port forwarding is active (`kubectl port-forward service/book-api-service 8080:8080`)
3. **Image pull errors**: Verify Docker images are pushed to Docker Hub and accessible
4. **CORS errors**: Confirm the Spring Boot application has CORS configuration enabled

For detailed logs, use:

```bash
kubectl logs deployment/spring-deployment
kubectl logs deployment/react-deployment
```
