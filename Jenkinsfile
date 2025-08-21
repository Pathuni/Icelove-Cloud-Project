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
        withCredentials([string(credentialsId: 'test-dockerhubpassword', variable: 'DOCKERHUB_PASSWORD')]) {
            bat """
            echo %DOCKERHUB_PASSWORD% | docker login -u pathuni --password-stdin
            """
        }
    }
}


       stage('Push Docker Images') {
    steps {
        script {
            bat "docker push pathuni/icelove-frontend:%BUILD_NUMBER%"
            bat "docker push pathuni/icelove-backend:%BUILD_NUMBER%"
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
