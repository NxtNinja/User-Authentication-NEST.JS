# NestJS Authentication System with Prisma Documentation
## Installation Steps:

1. Download the Zip file

2. Install Node.js modules:
   cd project_directory
   ```
   npm install
   ```
4. Run Prisma migrations to create database tables:
   ```
   npx prisma migrate dev
   ```

## Starting the Project:

1. Start the NestJS server:

   ```
   npm run start:dev
   ```

## APIs:

### /signup - Sign Up
- **Method:** POST
- **Description:** Used for user registration.
- **Request Body:**
  ```json
  {
    "name": "fName lName",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully"
  }
  ```

### /login - Log In
- **Method:** POST
- **Description:** Used for user login.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "<access_token>",
    "refreshToken": "<refresh_token>"
  }
  ```

### /logout - Log Out
- **Method:** POST
- **Description:** Used for user logout.
- **Request Header:**
  ```
  Authorization: Bearer <access_token>
  ```
- **Response:**
  ```json
  {
    "message": "User logged out successfully"
  }
  ```

### /refresh - Refresh Tokens
- **Method:** POST
- **Description:** Used for refreshing access and refresh tokens.
- **Request Header:**
  ```Bearer
    Authorization : Bearer <refresh_token>
  ```
- **Response:**
  ```json
  {
    "accessToken": "<new_access_token>",
    "refreshToken": "<new_refresh_token>"
  }
  ```