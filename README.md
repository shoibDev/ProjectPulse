# ProjectPulse (Underdevelopment)

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

## Authentication Process

### Key Components
- **UserDetailsService**: Custom service that loads user data from the database. It is crucial for authenticating users based on their username, which in this case, is the user's email.
- **AuthenticationProvider**: Uses `DaoAuthenticationProvider` for authenticating users. It incorporates the `UserDetailsService` for retrieving user details and `PasswordEncoder` for verifying user passwords against encrypted values stored in the database.
- **PasswordEncoder**: Implements `BCryptPasswordEncoder` to securely hash and verify passwords.
- **JwtService**: Manages all operations related to JWTs, including token generation, expiration validation, and extraction of the username from tokens.
- **JwtAuthenticationFilter**: An HTTP request filter that checks for valid JWTs in the Authorization header of incoming requests and sets the authentication in the security context.

### Security Configurations
- **HttpSecurity**: Configures security constraints on the web layer. It disables CSRF protection due to the stateless nature of JWTs and configures session management to be stateless.
- **WebSecurity**: Enables method-level security across the application, ensuring that certain methods can only be accessed by users with specific roles.

### Authentication Flow

![image](https://github.com/shoibDev/ProjectPulse/assets/86535871/09d2735b-085d-48c5-bb7d-e7c2744647dd)
   
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
