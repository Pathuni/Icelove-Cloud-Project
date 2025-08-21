pipeline {
    agent any 

    stages { 
        stage('SCM Checkout') {
            steps {
                retry(10) {
                    git branch: 'main', url: 'https://github.com/Pathuni/Icelove-Cloud-Project'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    bat "docker build -t pathuni/icelove-frontend:%BUILD_NUMBER% icelove-client"
                    bat "docker build -t pathuni/icelove-backend:%BUILD_NUMBER% icelove-server"
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                 
                withCredentials([string(credentialsId: 'test-dockerhubpassword', variable: 'dockerhub-password')]) {
    bat "docker login -u nipunikumudika -p ${PW}"
}
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    bat 'docker-compose up -d'
                }
            }
        }
    }

    post {
        always {
            bat 'docker logout'
        }
    }
}
