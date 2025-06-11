
# express-template

A scalable Node.js backend template built with Express and TypeScript, designed to accelerate development with a production-ready setup.

## Introduction

This template offers a solid starting point for developing modern Node.js backend applications with Express and TypeScript. It includes necessary features such as user authentication (JWT and Google OAuth), MongoDB and Redis for storage, Google Cloud Storage for file uploads, and real-time communication with Socket.IO. With modular architecture, thorough logging, and email verification, it's designed to free developers from hours of setup time and provide scalability and type safety. Whether you’re prototyping a startup idea or building a large-scale application, this template streamlines your workflow.

## Table of Contents

- [express-template](#express-template)
  - [Introduction](#introduction)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Who Is This For?](#who-is-this-for)
  - [Why Use This Template?](#why-use-this-template)
  - [Requirements](#requirements)
  - [Setup](#setup)
    - [1. Clone the repository](#1-clone-the-repository)
    - [2. Install dependencies](#2-install-dependencies)
    - [3. Environment variables](#3-environment-variables)
    - [4. Google Cloud Storage setup](#4-google-cloud-storage-setup)
    - [5. MongoDB setup](#5-mongodb-setup)
    - [6. Redis setup](#6-redis-setup)
    - [7. SMTP setup](#7-smtp-setup)
    - [8. Running the server](#8-running-the-server)
      - [Development](#development)
      - [Production](#production)
  - [Usage Examples](#usage-examples)
    - [User Registration](#user-registration)
    - [File Upload](#file-upload)
    - [Real-Time Chat](#real-time-chat)
  - [Project Structure](#project-structure)
  - [Scripts](#scripts)
  - [Development Notes](#development-notes)
  - [Troubleshooting](#troubleshooting)
  - [Contributing](#contributing)
  - [License](#license)

## Features

-   User registration, login, and Google OAuth
-   Email verification and password reset via OTP
-   JWT-based authentication and session management
-   File/media upload to Google Cloud Storage
-   Logging (Winston, Morgan) and audit logs
-   Modular route and service structure
-   Redis for queues, OTP, and Socket.IO adapter
-   TypeScript for type safety

## Who Is This For?

This template is intended for:

- **New developers** learning backend development using Node.js and TypeScript, who want to use a pre-configured project to try out authentication, databases, and real-time functionality.
- **Production-ready developers** creating production applications that require a scalable, modular foundation to minimize boilerplate code duplication.
- **Project Teams** which develop projects that need user administration, file storage, and real-time communication and for which maintainability and extensibility are an issue.

## Why Use This Template?

-   **Time-Saving:** Pre-built authentication, database integration, and file upload systems let you focus on your application’s unique features.
-   **Scalable Architecture:** Modular design supports growth from small prototypes to large-scale applications.
-   **Production-Ready:** Includes logging, error handling, and security features like JWT and email verification.
-   **Type Safety:** TypeScript ensures robust code with fewer runtime errors.
-   **Real-Time Support:** Socket.IO enables seamless integration of real-time features like chat or notifications.

## Requirements

-   Node.js (v18+ recommended)
-   Yarn or npm
-   MongoDB (local or remote)
-   Redis (local or remote)
-   Google Cloud account (for Storage)
-   SMTP credentials (for email sending)

## Setup

### 1. Clone the repository

```sh
git clone https://github.com/muddledluck/express-template.git
cd backend

```

### 2. Install dependencies

```sh
yarn install
# or
npm install

```

### 3. Environment variables

Copy `.env.example` to `.env` and fill in the required values:

```sh
cp .env.example .env

```

**Required fields:**

-   `PORT` - Port to run the server
-   `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - MongoDB connection
-   `JWT_SECRET` - Secret for JWT signing
-   `ANDROID_CLIENT_ID`, `IOS_CLIENT_ID`, `WEB_CLIENT_ID` - Google OAuth client IDs
-   `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_USER` - SMTP config
-   `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_URL` - Redis config
-   `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_CLOUD_BUCKET_NAME` - Google Cloud Storage

**Do not commit your `.env` file.**

### 4. Google Cloud Storage setup

-   Create a Google Cloud project and enable Storage.
-   Create a service account with Storage permissions.
-   Download the service account key as `google-cloud-key.json` and place it in the project root.
-   Set `GOOGLE_CLOUD_PROJECT_ID` and `GOOGLE_CLOUD_BUCKET_NAME` in `.env`.

**Do not commit `google-cloud-key.json`.**

### 5. MongoDB setup

-   Install and run MongoDB locally, or use a cloud provider (e.g., MongoDB Atlas).
-   Update `.env` with your MongoDB connection details.

### 6. Redis setup

-   Install and run Redis locally or via docker, or use a managed Redis service.
-   Update `.env` with your Redis connection details.

### 7. SMTP setup

-   Use a real SMTP provider (Gmail, SendGrid, Mailgun, etc.).
-   Update `.env` with your SMTP credentials.

### 8. Running the server

#### Development

```sh
yarn dev
# or
npm run dev

```

#### Production

```sh
yarn build
yarn start
# or
npm run build
npm start

```

## Usage Examples

Below are examples to demonstrate how to use key features of this template:

### User Registration

Send a POST request to register a new user:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
-H "Content-Type: application/json" \
-d '{"email": "user@example.com", "password": "securepassword", "name": "John Doe"}'

```

### File Upload

Upload a file to Google Cloud Storage using a POST request (requires authentication):

```bash
curl -X POST http://localhost:3000/api/v1/media/upload \
-H "Authorization: Bearer <your-jwt-token>" \
-H "Content-Type: multipart/form-data" \
-F "file=@/path/to/your/file.jpg"

```

### Real-Time Chat

Connect to the Socket.IO server for real-time communication (e.g., a chat feature):

```javascript
// Client-side JavaScript
import io from 'socket.io-client';
const socket = io('http://localhost:3000');
socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('message', { user: 'John', text: 'Hello!' });
});
socket.on('message', (data) => {
  console.log('New message:', data);
});

```

<!-- For more examples, check the [sample project](https://github.com/muddledluck/express-template-example) (placeholder link—consider creating one). -->

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration (db, logger, email, etc.)
│   ├── middleware/     # Express middlewares
│   ├── module/         # Feature modules (auth, user, otp, media, etc.)
│   ├── templates/      # Email templates
│   ├── types/          # TypeScript type definitions
│   ├── route.ts        # Main route registry
│   └── server.ts       # Express app/server setup
├── logs/               # Log files (gitignored)
├── .env.example        # Example environment variables
├── google-cloud-key.json # Google Cloud credentials (not committed)
├── package.json
├── tsconfig.json
└── README.md

```

## Scripts

-   `yarn dev` / `npm run dev` - Start development server with hot reload
-   `yarn build` / `npm run build` - Compile TypeScript to `dist/`
-   `yarn start` / `npm start` - Run compiled server

## Development Notes

-   **Do not commit sensitive files:** `.env`, `google-cloud-key.json`, and `logs/` are gitignored.
-   **Email templates:** Located in `src/templates/email/`. Use `{{variable}}` syntax for dynamic values.
-   **Adding modules:** Use `module-create.sh` to scaffold new modules.
-   **Logging:** All requests and errors are logged to `logs/` and rotated automatically.
-   **API base path:** All routes are prefixed with `/api/v1`.

## Troubleshooting

-   **MongoDB/Redis connection errors:** Check your `.env` values and ensure services are running.
-   **Google Cloud errors:** Ensure `google-cloud-key.json` is present and valid, and bucket exists.
-   **SMTP errors:** Verify SMTP credentials and network access.
-   **CORS issues:** Update allowed origins in `src/server.ts` and `.env` as needed.

## Contributing

Contributions are welcome! To get started:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/your-feature`).
3.  Commit your changes (`git commit -m 'Add your feature'`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Open a pull request.

Please report issues or suggest improvements via [GitHub Issues](https://github.com/muddledluck/express-template/issues).

## License

MIT