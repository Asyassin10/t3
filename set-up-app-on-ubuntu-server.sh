#!/bin/bash
# Update package lists
apt-get update -y

# Install prerequisites
apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Set up the Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable" \
    | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package lists again
apt-get update -y

# Install Docker Engine, CLI, containerd, and Docker Compose plugin
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Enable Docker service to start on boot
systemctl enable docker
systemctl start docker

# Optional: Add ubuntu user to the docker group to run docker without sudo
usermod -aG docker ubuntu

# Go to ubuntu home
cd /home/ubuntu

# Create working directory
mkdir -p app
cd app
# Clone your repo with credentials (⚠️ insecure)
git clone https://zack965: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@github.com/drisselkholti/T3.git

# Adjust permissions
chown -R ubuntu:ubuntu /home/ubuntu/app
#export the env variable
#export DB_DATABASE={$DbName}
# cd to the repo
./setup.sh
cd t3_app/
docker compose build --no-cache && docker compose up -d
cd ..
cd t3_system
docker compose build --no-cache && docker compose up -d
