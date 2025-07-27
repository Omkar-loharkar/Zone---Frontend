# Zone - Find your next job

A modern job platform for candidates and HRs to connect, apply, and manage job applications.

## Features
- Candidate and HR registration/login
- JWT-based authentication
- Job posting and management (HR)
- Job search and application (Candidate)
- Application status tracking
- Responsive, modern UI (Material-UI, React)
- Light/Dark mode (default: dark)

## Tech Stack
- **Frontend:** React, Material-UI (MUI)
- **Backend:** Java Spring Boot, MySQL, JWT

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- Java 11+
- Maven
- MySQL

### Setup
#### 1. Clone the repository
```
git clone <your-repo-url>
cd JobPlatform
```

#### 2. Configure the Backend
- Update `backend/src/main/resources/application.properties` with your MySQL credentials.

#### 3. Start the Backend
```
cd backend
mvn clean package
java -jar target/backend-1.0-SNAPSHOT.jar
```

#### 4. Setup and Build the Frontend
```
cd ../frontend
npm install
npm run build
```
- Copy the contents of `frontend/build` to `backend/src/main/resources/static` to serve the frontend from the backend.

#### 5. Access the App
- Open [http://localhost:8080](http://localhost:8080) in your browser.

## Development
- For frontend development, run `npm start` in the `frontend` folder.
- For backend development, use your preferred Java IDE or run via Maven.

## Deployment
- Deploy the backend (with static files) to your preferred Java hosting (AWS, Heroku, etc.).
- Ensure your database is accessible and credentials are set.

## Contact
For questions or support, contact the maintainer at [your-email@example.com].
