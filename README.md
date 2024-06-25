# ProjectPulse

## Introduction
ProjectPulse is a robust bug tracking system designed to facilitate efficient project management and issue resolution. Built with Spring Boot, React.js, TypeScript, and PostgreSQL, this system ensures secure and efficient handling of project data and user interactions.

## Features
- **JWT Authentication and Authorization:** Integrated a comprehensive authentication system using JSON Web Tokens (JWT) to secure endpoints, manage token issuance and validation, and protect sensitive user data.
- **JPA Integration:** Utilized Java Persistence API (JPA) for seamless interaction with the PostgreSQL database, ensuring efficient data management and retrieval.
- **Type Safety with TypeScript:** Leveraged TypeScript to enhance code reliability and maintainability by catching type-related issues at compile time, significantly reducing runtime errors.
- **Focus on Authentication:** The primary focus of development was on building a robust authentication system, ensuring that security was prioritized and user credentials were handled securely throughout the application.
- **Dockerized PostgreSQL:** Implemented PostgreSQL within a Docker container to ensure a consistent and isolated environment for database operations, simplifying setup and scalability.

## Technologies
- **Spring Boot:** Backend framework providing powerful, easy-to-integrate features for rapid development.
- **React.js:** Frontend library for building user interfaces with efficient, declarative components.
- **TypeScript:** Superset of JavaScript offering type safety at compile time.
- **PostgreSQL:** Reliable and powerful open source relational database.
- **Docker:** Used to containerize PostgreSQL, ensuring a consistent environment across different development stages.

## Visuals

![chrome-capture-2024-6-25](https://github.com/shoibDev/ProjectPulse/assets/86535871/b7ac6626-9c99-4179-95f3-7b8565a628ca)

## Installation
```bash
git clone https://github.com/shoibDev/ProjectPulse.git
cd projectpulse
```

### Setting Up PostgreSQL with Docker
To set up the PostgreSQL database using Docker, run the following command:
```bash
docker run --name postgresql-container -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
```

# Start the backend server
cd backend
./mvnw spring-boot:run

# Start the frontend development server
cd frontend
npm start
