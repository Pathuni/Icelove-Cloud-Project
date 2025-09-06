# Icelove Cloud Project

This project consists of a **React + Vite frontend** and a **Node.js backend**. It can be run locally or deployed using Docker, Docker Compose, Jenkins, AWS, and Kubernetes.

---

## Project Structure

```
Icelove-Cloud-Project/
│
├─ icelove-client/       # React + Vite frontend
├─ icelove-server/       # Python.js backend
├─ docker-compose.yaml   # Docker Compose file
└─ Jenkinsfile           # Jenkins pipeline file
```

---

## Prerequisites

Before running the project, make sure you have:

* Go (1.18+ recommended)
* npm or yarn
* Docker & Docker Compose
* Jenkins, AWS CLI, kubectl

---

## Running Locally

### Frontend

```bash
cd icelove-client
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.

### Backend

```bash
cd icelove-server
cd icelove-server/checkoutservice
go build -o checkoutservice
./checkoutservice
```

Do This for all of the services

---

## Docker Setup

### Build Docker Images

#### Frontend

```bash
cd icelove-client
docker build -t icelove-frontend .
```

#### Backend

```bash
cd icelove-server/checkoutservice
docker build -t icelove-checkoutservice .
```
Repeat for other services as needed.

### Run Containers Individually

```bash
docker run -p 5173:5173 icelove-frontend
docker run -p 5000:5000 icelove-checkoutservice
```

---

## Docker Compose

Use Docker Compose to run both frontend and backend together:

```bash
docker-compose down
docker-compose up -d --build
```

* `down` stops and removes containers.
* `up -d --build` rebuilds images and runs containers in detached mode.

Check logs:

```bash
docker-compose logs -f
```

---

## CI/CD Deployment with Jenkins, AWS, and Kubernetes

### 1. Add Project to Jenkins

* Install Jenkins and required plugins:

  * **Pipeline**, **Git**, **Docker Pipeline**, **Kubernetes CLI Plugin** (if using EKS)
* Create a **New Item → Pipeline** in Jenkins
* Connect your GitHub repository
* Use the **existing `Jenkinsfile`** in the repo for the pipeline
* Ensure Jenkins has:

  * **Docker access**
  * **AWS CLI installed** if deploying to EKS
  * **kubectl installed** if deploying to Kubernetes

### 2. Push Docker Images to AWS (ECR)

1. Authenticate to AWS ECR:

```bash
aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.<region>.amazonaws.com
```

2. Create repositories in ECR:

```bash
aws ecr create-repository --repository-name icelove-frontend
aws ecr create-repository --repository-name icelove-backend
```

3. Tag and push Docker images:

```bash
docker tag icelove-frontend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/icelove-frontend:latest
" + 
"docker tag icelove-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/icelove-backend:latest

docker push <account-id>.dkr.ecr.<region>.amazonaws.com/icelove-frontend:latest
" + 
"docker push <account-id>.dkr.ecr.<region>.amazonaws.com/icelove-backend:latest
```

### 3. Deploy to Kubernetes (EKS or local)

1. Configure `kubectl` for your cluster:

```bash
aws eks --region <region> update-kubeconfig --name <cluster-name>
```

3. Apply manifests:

```bash
kubectl apply -f frontend-deployment.yaml
kubectl apply -f backend-checkoutservice.yaml
```
Do this for all services

4. Verify pods and services:

```bash
kubectl get pods
kubectl get svc
```
