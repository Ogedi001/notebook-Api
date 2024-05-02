# My Notebook API

Welcome to the documentation for My Notebook API!

## Introduction

My Notebook API a simple note-taking application that provides endpoints for managing notebooks(including notebook tagging and sharing between users and users) and authentication.

## Technologies Used
- Node.js
- Express.js
- TypeScript
- Prisma(Postgres DB)
- JWT (JSON Web Tokens)
- bcrypt
- EJS
- Express-validator
- Jest (for testing)
- Nodemailer
- Redis
- Winston (for logging)
- CORS
- Helmet
- dotenv

## Documentation

For detailed API documentation and examples, please refer to the [Postman Documentation](https://documenter.getpostman.com/view/26097715/2sA35JyzJ6).


## Endpoints

### User Authentication

- `POST /api/v1/auth/signup-user`: Sign up a new user.
- `POST /api/v1/auth/login-user`: Log in a user.
- `POST /api/v1/auth/forgot-password`: Send a password reset email.
- `POST /api/v1/auth/reset-password/:token`: Reset user password.
- `POST /api/v1/auth/verify-email/:userId/:token`: Verify user email.

### Notebooks

- `POST /api/v1/notebook`: Create a new notebook.
- `GET /api/v1/notebook`: Get all notebooks.
- `GET /api/v1/notebook/:id`: Get a notebook by ID.
- `PATCH /api/v1/notebook/:id`: Update a notebook.
- `PATCH /api/v1/notebook/:id/share`: Share a notebook with other users.
- `DELETE /api/v1/notebook/:id`: Delete a notebook by ID.

## Authentication

My Notebook API uses JWT for authentication. Include the JWT token in the Authorization header for protected endpoints.

## Installation

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up environment variables: Rename `.env.example` to `.env` and fill in the required variables.
```plaintext
   JWT_EXPIRES_IN=''
   JWT_SECRET=''
   SALT=''

   FRONTEND_BASE_URL=""

   SMTP_HOST=" "
   SMTP_PORT=" "
   SMTP_USERNAME=" "
   SMTP_PASSWORD=""
   SMTP_SENDER=""
4. Start the server: `npm run dev`.
5. import Admin user to db 'npm run import:data'

## Usage

```bash
# Example: Sign up a new user
curl --location --request POST 'http://localhost:3000/api/v1/auth/signup-user' \
--data '{
  "firstname":"John",
  "lastname":"Doe",
  "email":"john@example.com", 
  "password":"password"
}'

Response Codes
200 OK: Successful request.
400 Bad Request: Invalid request parameters.
401 Unauthorized: Authentication failure.
404 Not Found: Resource not found.
500 Internal Server Error: Server error.

Error Handling
Errors are returned as JSON objects with a message field describing the error.
