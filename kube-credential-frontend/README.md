My Personal Information
Name :- Anuraag Milind Lahase
Mobile Number :- 9890031874
Email :- amlahase@gmail.com , anuraaglahase@gmail.com
Kube Credentials
Overview
This project implements a backend system consisting of two microservices:

1) Credential Backend

2) Verification Backend

Deployed on Kubernetes with ingress controller for routing and NodePort services for external access.

Architecture
The system is composed of these key components:

Microservices: Two Node.js applications running separately for credential and verification functionality.

Kubernetes Deployment: Each backend runs in a pod with a deployment controlling lifecycle.

Services: Kubernetes NodePort services expose pods on specific ports for external access.

Ingress Controller: NGINX ingress routes incoming HTTP requests based on hostname and path prefix to appropriate services.

Hosts Mapping: backend.local resolves to Minikube IP or localhost for local development.

Design Decisions
Microservices separation supports independent development, testing, and scaling of workflows.

Kubernetes chosen for container orchestration and service discovery.

Ingress usage allows centralized routing and easy domain-based URL structure.

NodePort services provide direct access to pods during development and debugging.

Application ports and service ports carefully matched for consistency.

Codebase Structure
/project-root
│
├── /credential-backend          # Credential microservice source and deployment configs
│   ├── /src                    # Application source code
│   │   ├── controllers         # Request handlers for various routes
│   │   ├── models              # Database or data models
│   │   ├── routes              # Route definitions mapping URLs to controllers
│   │   ├── services            # Business logic separate from routes and controllers
│   │   ├── utils               # Utility functions/helpers
│   │   ├── middleware          # Express middleware for request processing
│   │   └── server.js           # Application entry point
│   ├── dist                    # Compiled/transpiled source (e.g. from TypeScript)
│   ├── Dockerfile              # Container image definition
│   ├── deployment.yaml         # Kubernetes deployment manifest
│   ├── service.yaml            # Kubernetes service manifest
│   └── .env                   # Environment variables configuration
│
├── /verification-backend        # Verification microservice with similar structure
│
├── ingress.yaml                # Ingress resource manifest mapping domains / paths to services
└── README.md                   # Project documentation


Credentials Table Schema:

id: SERIAL, PRIMARY KEY, unique identifier

user_id: VARCHAR(255), NOT NULL, user identifier

credential_type: VARCHAR(100), NOT NULL, type of credential (e.g., diploma)

credential_data: TEXT, JSON or formatted credential information

issued_date: DATE, NOT NULL, date credential was issued














# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
