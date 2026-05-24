environment {
    PATH = "/usr/local/node/bin:/usr/bin:/bin"
}
pipeline {
    agent any

    environment {
        IMAGE_NAME = "dagi27/websocket-app"
        CONTAINER_NAME = "websocket-app-container"
        PORT = "3000"
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "📥 Pulling code from GitHub..."
                git branch: 'main',
                    url: 'https://github.com/Dagemgissila/node-express-websocket.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing npm packages..."
                sh 'npm install'
            }
        }

        stage('Run Database Migrations') {
            steps {
                echo "🗄️ Running Drizzle migrations..."
                sh 'npm run migrate || echo "No migration script found"'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                sh "docker build -t $IMAGE_NAME:latest ."
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo "🔐 Logging into Docker Hub..."
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                echo "📤 Pushing image..."
                sh "docker push $IMAGE_NAME:latest"
            }
        }

        stage('Stop Old Container') {
            steps {
                echo "🛑 Stopping old container (if exists)..."
                sh "docker stop $CONTAINER_NAME || true"
                sh "docker rm $CONTAINER_NAME || true"
            }
        }

        stage('Run New Container') {
            steps {
                echo "🚀 Running new container..."
                sh """
                    docker run -d \
                    --name $CONTAINER_NAME \
                    -p $PORT:3000 \
                    --env-file .env \
                    $IMAGE_NAME:latest
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
        }

        failure {
            echo "❌ Deployment failed. Check logs."
        }
    }
}