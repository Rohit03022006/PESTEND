pipeline {
    agent any
    environment {
        BACKEND_IMAGE = 'rohitxten/pestend_backend_app:latest'
        FRONTEND_IMAGE = 'rohitxten/pestend_frontend_app:latest'
        DOCKER_REGISTRY = 'docker.io' 
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/Rohit03022006/PESTEND.git'
            }
        }
        
        stage('Build and Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DockerHubCredential',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                    # Login to Docker Hub
                    docker login -u "$DOCKER_USER" -p "$DOCKER_PASS" $DOCKER_REGISTRY
                    
                    # Build and push backend
                    echo "Building backend image..."
                    docker build -t $BACKEND_IMAGE ./backend
                    docker push $BACKEND_IMAGE
                    
                    # Build and push frontend
                    echo "Building frontend image..."
                    docker build -t $FRONTEND_IMAGE ./frontend
                    docker push $FRONTEND_IMAGE
                    
                    # Logout from Docker
                    docker logout $DOCKER_REGISTRY
                    """
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                sh 'docker stop pestend-frontend pestend-backend || true'
                sh 'docker rm pestend-frontend pestend-backend || true'
                sh """
                docker run -d \
                  --name pestend-backend \
                  --restart unless-stopped \
                  -e MONGODB_URI="" \
                  -e CLIENT_URL="http://localhost:5173" \
                  -e PORT=5000 \
                  -e NODE_ENV=production \
                  -e API_PREFIX=/api \
                  -p 5000:5000 \
                  $BACKEND_IMAGE
                """
            
                sh """
                docker run -d \
                  --name pestend-frontend \
                  --restart unless-stopped \
                  -e VITE_WEATHER_API_KEY=48fecb67dc2d573ccdc680edf5bd14ca \
                  -e VITE_API_BASE_URL=http://localhost:5000/api \
                  -p 80:80 \
                  $FRONTEND_IMAGE
                """
                
                sh '''
                sleep 10
                echo "Checking backend health..."
                curl -f http://localhost:5000/health || exit 1
                echo "Backend is healthy!"
                
                echo "Checking frontend health..."
                curl -f http://localhost:80 || exit 1
                echo "Frontend is healthy!"
                '''
            }
        }
    }
    post {
        failure {
            echo 'Pipeline failed! Check the logs for details.'
            sh 'docker logs pestend-backend || true'
            sh 'docker logs pestend-frontend || true'
        }
        success {
            echo 'Pipeline succeeded! Application deployed successfully.'
            sh '''
            echo "Running Containers "
            docker ps --filter "name=pestend-"
            echo ""
            echo "Application URLs"
            echo "Frontend: http://localhost:80"
            echo "Backend API: http://localhost:5000/api"
            echo "Backend Health: http://localhost:5000/health"
            '''
        }
        always {
            sh 'docker system prune -f || true'
        }
    }
}