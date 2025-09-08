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
                git branch: 'master', 
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
                    # Check if requirements.txt exists
                    echo "Checking Backend directory structure:"
                    ls -la ./Backend/
                    
                    # Login to Docker Hub
                    docker login -u "$DOCKER_USER" -p "$DOCKER_PASS" $DOCKER_REGISTRY
                    
                    # Build and push backend
                    echo "Building backend image..."
                    docker build -t $BACKEND_IMAGE ./Backend
                    
                    # Build and push frontend
                    echo "Building frontend image..."
                    docker build -t $FRONTEND_IMAGE ./Frontend
                    
                    docker push $BACKEND_IMAGE
                    docker push $FRONTEND_IMAGE
                    
                    # Logout from Docker
                    docker logout $DOCKER_REGISTRY
                    """
                }
            }
        }  // <-- This closing bracket was missing!
        
        stage('Deploy Application') {
            steps {
                // Stop and remove any existing containers
                sh 'docker stop pestend-frontend pestend-backend || true'
                sh 'docker rm pestend-frontend pestend-backend || true'
                
                // Create a network for containers to communicate
                sh 'docker network create pestend-network || true'
                
                // Start Backend
                sh """
                docker run -d \
                  --name pestend-backend \
                  --network pestend-network \
                  --restart unless-stopped \
                  -e MONGODB_URI="" \
                  -e PORT=5000 \
                  -e NODE_ENV=production \
                  -p 5000:5000 \
                  $BACKEND_IMAGE
                """
                
                // Start Frontend
                sh """
                docker run -d \
                  --name pestend-frontend \
                  --network pestend-network \
                  --restart unless-stopped \
                  -e VITE_WEATHER_API_KEY=48fecb67dc2d573ccdc680edf5bd14ca \
                  -e VITE_API_BASE_URL=http://pestend-backend:5000/api \
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
