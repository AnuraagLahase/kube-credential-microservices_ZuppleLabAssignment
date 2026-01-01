# kube-credential-microservices_ZuppleLabAssignment
Kubernetes-based credential management project with Node.js + Express microservices (issuance &amp; verification), React frontend, MySQL database, and Dockerized services.
## Overview
This project is a microservices-based credential management tool with separate services for credential issuance and verification.  
It is containerized with Docker.

## Architecture
- Credential Issuance Service (Node.js + Express, MySQL)
- Credential Verification Service (Node.js + Express, MySQL)
- React frontend 
- MySQL database
- Docker images for each service

## Tech Stack
- Backend: Node.js, Express, TypeScript
- Frontend: React, TypeScript
- Database: MySQL
- Containerization: Docker
- Other: dotenv, axios, etc.

## Setup & Running
1. Clone the repo
2. Build Docker images:
   - `docker build -t credential-backend ./credential-backend`
   - `docker build -t verification-backend ./verification-backend`
3. Access:
   - Issuance API (credential backend): http://localhost:3000/api/credentials
   - Verification API: http://localhost:4000/api/verification
   - Frontend: http://localhost:5173/

## Features
- Issue new credentials and store them in MySQL
- Verify credentials via a dedicated verification service
- Inter-service communication between microservices
- Basic logging and error handling

## Project Structure
- `credential-backend/` – issuance microservice (Node.js + Express)
- `verification-backend/` – verification microservice
- `frontend/` – React app 
- `docker/` or `Dockerfile`s – container definitions




