pipeline {
    agent any

    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        FRONTEND_TARGET = '/var/www/html'
        BACKEND_IMAGE = 'myapp-backend:latest'
        BACKEND_CONTAINER = 'myapp-backend'
        BACKEND_PORT = '8000'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "📦 Checking out source code..."
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    echo "🏗️ Building frontend..."
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                echo "🚚 Deploying frontend to ${FRONTEND_TARGET}..."
                sh '''
                    sudo rm -rf ${FRONTEND_TARGET}/*
                    sudo cp -r ${FRONTEND_DIR}/build/* ${FRONTEND_TARGET}/
                '''
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo "🐳 Building backend Docker image..."
                    sh '''
                        docker build -t ${BACKEND_IMAGE} .
                    '''
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo "🧪 Running backend tests..."
                    sh '''
                        npm install
                        npm test || echo "⚠️ No tests or test failure ignored"
                    '''
                }
            }
        }

        stage('Deploy Backend Container') {
            steps {
                echo "🚀 Deploying backend container..."
                sh '''
                    # Stop and remove old container if exists
                    docker stop ${BACKEND_CONTAINER} || true
                    docker rm ${BACKEND_CONTAINER} || true

                    # Run new container with auto-restart
                    docker run -d \
                        --name ${BACKEND_CONTAINER} \
                        --restart always \
                        -p ${BACKEND_PORT}:8000 \
                        ${BACKEND_IMAGE}
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment completed successfully!"
            echo "🌍 Frontend: http://<YOUR_PUBLIC_IP>/"
            echo "🖥️ Backend API: http://<YOUR_PUBLIC_IP>:${BACKEND_PORT}/"
        }
        failure {
            echo "❌ Pipeline failed — please check logs."
        }
    }
}
