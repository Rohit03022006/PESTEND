pipeline {
    agent any
    environment {
        BACKEND_IMAGE = 'rohitxten/pestend_backend_app:latest'
        FRONTEND_IMAGE = 'rohitxten/pestend_frontend_app:latest'
        DOCKER_REGISTRY = 'docker.io'
        MONGODB_URI = ''
        WEATHER_API_KEY = '' 
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'master', url: 'https://github.com/Rohit03022006/PESTEND.git'
            }
        }
        
        stage('Build and Push Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DockerHubCredential', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker build -t $BACKEND_IMAGE ./Backend
                    docker build -t $FRONTEND_IMAGE ./Frontend
                    docker push $BACKEND_IMAGE
                    docker push $FRONTEND_IMAGE
                    docker logout
                    '''
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker stop pestend-frontend pestend-backend || true'
                sh 'docker rm pestend-frontend pestend-backend || true'
                sh 'docker network create pestend-network || true'
                
                sh """
                docker run -d --name pestend-backend --network pestend-network \
                  -e MONGODB_URI="$MONGODB_URI" \
                  -e CLIENT_URL="http://localhost:5173" \
                  -e PORT=5000 \
                  -e NODE_ENV=production \
                  -p 5000:5000 \
                  $BACKEND_IMAGE
                  
                docker run -d --name pestend-frontend --network pestend-network \
                  -e VITE_WEATHER_API_KEY="$WEATHER_API_KEY" \
                  -e VITE_API_BASE_URL=http://pestend-backend:5000/api \
                  -p 80:80 \
                  $FRONTEND_IMAGE
                """
                
                sh '''
                sleep 20
                echo "Testing backend health..."
                if curl -f http://localhost:5000/api/health; then
                    echo "Backend health check passed"
                else
                    echo "Backend health check failed"
                    exit 1
                fi
                
                echo "Testing frontend..."
                if curl -f http://localhost:80; then
                    echo "Frontend is serving content"
                else
                    echo "Frontend check failed but continuing..."
                fi
                '''
            }
        }
    }
    
    post {
        always {
            sh 'docker system prune -f || true'
        }
        success {
            echo 'Deployment successful!'
            sh '''
            echo "Running Containers"
            docker ps --filter "name=pestend-"
            echo ""
            echo "Application URLs"
            echo "Frontend: http://localhost:80"
            echo "Backend API: http://localhost:5000/api"
            echo "Backend Health: http://localhost:5000/api/health"
            echo "Backend Test: http://localhost:5000/api/test"
            '''
        }
        failure {
            echo 'Deployment failed - checking logs...'
            sh '''
            echo "Backend Logs"
            docker logs pestend-backend || true
            echo "Frontend Logs"
            docker logs pestend-frontend || true
            '''
        }
    }
}
