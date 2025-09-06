# Icelove Cloud Project

This project develops a cloud-based **Ice Cream Ordering Platform** designed for scalability, high availability, and security, using a microservices architecture. The platform supports user functionalities like browsing products, placing orders, and managing profiles, while administrators handle inventory and user roles. It leverages AWS EKS for Kubernetes orchestration, Jenkins for CI/CD, and AWS for infrastructure, with a focus on modularity, security via IAM roles and Kubernetes RBAC, and automated deployment.

---

## Project Structure

```
Icelove-Cloud-Project/
│
├─ frontend/               # source code
├─ server/               # Microservices source code
├─ infra-setup/ 
├─ deployement-service/             # Kubernetes manifests (Deployment, Service, Ingress)
└─ Jenkinsfile             # Jenkins pipeline configuration
```

---

## Prerequisites

Before running the project, ensure you have:
- AWS CLI, kubectl, eksctl
- Jenkins (with plugins: Pipeline, Git, Kubernetes CLI)
- AWS account with IAM roles for EC2 and EKS access
- GitHub account and repository access
- MobaXterm for SSH access

---

## Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Pathuni/Icelove-Cloud-Project.git
   cd Icelove-Cloud-Project
   ```
2. Follow service-specific instructions in the `server/` directory to run locally. 
---

## CI/CD Deployment with Jenkins, AWS, and Kubernetes

### 1. AWS Infrastructure Setup
- **EC2 Instance**: Provision an AWS EC2 instance (Ubuntu 24.04 LTS, 8GB RAM) to host Jenkins. Configure security groups for SSH (port 22), HTTP (port 80), and Jenkins (port 8080).
- **IAM Roles**: Create IAM roles with least privilege for EC2 and EKS access to manage resources securely.
- **CLI Tools**: Install AWS CLI, kubectl, and eksctl on the EC2 instance using MobaXterm for SSH access:
# AWSCLI

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install unzip
unzip awscliv2.zip
sudo ./aws/install
aws configure
```

## KUBECTL

```bash
curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.19.6/2021-01-05/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin
kubectl version --short --client
```

## EKSCTL

```bash
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
eksctl version
```

### 2. Jenkins Setup
- Install Java JDK 17 and Jenkins on the EC2 instance:
  ```bash
  sudo apt install -y openjdk-17-jdk
  sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
  echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list
  sudo apt update && sudo apt install -y jenkins
  ```
- Install Jenkins plugins: Pipeline, Git, Kubernetes CLI.
- Configure credentials for GitHub in Jenkins to securely access the repository.

### 3. EKS Cluster Creation
- Create an AWS EKS cluster with autoscaling node groups (min 2, max 4 nodes):
  ```bash
  eksctl create cluster --name cluster-name --region <your-region> --nodegroup-name group-name --node-type t3.medium --nodes-min 2 --nodes-max 4 --managed
  ```

### 4. Jenkins Pipeline Configuration
- Create a multibranch pipeline in Jenkins, linking to the GitHub repository: `https://github.com/Pathuni/Icelove-Cloud-Project`.
- Use the `Jenkinsfile` to define build, test, and deployment stages for each microservice.
- Configure GitHub webhooks to trigger pipelines on code pushes:
  - In GitHub, add a webhook with the Jenkins URL (e.g., `http://<ec2-public-ip>:8080/github-webhook/`).

### 5. Kubernetes RBAC and Service Account 
- Create a `jenkins` service account in the `webapps` namespace with RBAC:
  ```bash
  kubectl create namespace webapps
  kubectl create serviceaccount jenkins -n webapps
  kubectl create role jenkins-role -n webapps --verb=get,list,create,update,delete --resource=pods,services,deployments
  kubectl create rolebinding jenkins-binding -n webapps --role=jenkins-role --serviceaccount=webapps:jenkins
  ```
- Generate a token for the service account and add it to Jenkins credentials:
  ```bash
  kubectl -n webapps describe secret $(kubectl -n webapps get secret | grep jenkins | awk '{print $1}')
  ```

### 6. Deploy to EKS
- Apply Kubernetes manifests for microservices:
  ```bash
  kubectl apply -f kubernetes/deployment.yaml -n webapps
  kubectl apply -f kubernetes/service.yaml -n webapps
  kubectl apply -f kubernetes/ingress.yaml -n webapps
  ```
- Verify deployment:
  ```bash
  kubectl get pods -n webapps
  kubectl get svc -n webapps
  ```

### 7. Access the Application
- Retrieve the LoadBalancer URL:
  ```bash
  kubectl get svc -n webapps
  ```
- Access the platform via the provided URL to test functionality (e.g., browsing, ordering).

### 8. Cluster Cleanup
- Delete the EKS cluster to minimize costs:
  ```bash
  eksctl delete cluster --name EKS-cluster --region <your-region>
  ```

---

## Security Measures
- **IAM Roles**: Restrict EC2 and EKS access to least privilege.
- **Kubernetes RBAC**: Use the `jenkins` service account with limited permissions for secure deployments.
- **JWT Authentication**: Secure user sessions and API endpoints.
- **Secret Management**: Store sensitive data in Jenkins credentials.

---

## Notes
- Autoscaling is configured in EKS (2–4 nodes) and Kubernetes pods for scalability.
- High availability is achieved with multiple pod replicas across availability zones and Kubernetes Ingress for load balancing.
- AWS Free Tier and local testing minimize costs.

---

## GitHub Repository
[https://github.com/Pathuni/Icelove-Cloud-Project](https://github.com/Pathuni/Icelove-Cloud-Project)