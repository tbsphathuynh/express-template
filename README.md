# Backend

A Node.js backend server built with Express, TypeScript, MongoDB, Redis, Google Cloud Storage, and more.

---

## Table of Contents

- [Backend](#backend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
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
  - [Project Structure](#project-structure)
  - [Scripts](#scripts)
  - [Development Notes](#development-notes)
  - [Troubleshooting](#troubleshooting)
  - [License](#license)

---

## Features

- User registration, login, and Google OAuth
- Email verification and password reset via OTP
- JWT-based authentication and session management
- File/media upload to Google Cloud Storage
- Logging (Winston, Morgan) and audit logs
- Modular route and service structure
- Redis for queues, OTP, and socket.io adapter
- TypeScript for type safety

---

## Requirements

- Node.js (v18+ recommended)
- Yarn or npm
- MongoDB (local or remote)
- Redis (local or remote)
- Google Cloud account (for Storage)
- SMTP credentials (for email sending)

---

## Setup

### 1. Clone the repository

```sh
git clone <repo-url>
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

- `PORT` - Port to run the server
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - MongoDB connection
- `JWT_SECRET` - Secret for JWT signing
- `ANDROID_CLIENT_ID`, `IOS_CLIENT_ID`, `WEB_CLIENT_ID` - Google OAuth client IDs
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_USER` - SMTP config
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_URL` - Redis config
- `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_CLOUD_BUCKET_NAME` - Google Cloud Storage

**Do not commit your `.env` file.**

### 4. Google Cloud Storage setup

- Create a Google Cloud project and enable Storage.
- Create a service account with Storage permissions.
- Download the service account key as `google-cloud-key.json` and place it in the project root.
- Set `GOOGLE_CLOUD_PROJECT_ID` and `GOOGLE_CLOUD_BUCKET_NAME` in `.env`.

**Do not commit `google-cloud-key.json`.**

### 5. MongoDB setup

- Install and run MongoDB locally, or use a cloud provider (e.g., MongoDB Atlas).
- Update `.env` with your MongoDB connection details.

### 6. Redis setup

- Install and run Redis locally, or use a managed Redis service.
- Update `.env` with your Redis connection details.

### 7. SMTP setup

- Use a real SMTP provider (Gmail, SendGrid, Mailgun, etc.).
- Update `.env` with your SMTP credentials.

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

---

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

---

## Scripts

- `yarn dev` / `npm run dev` - Start development server with hot reload
- `yarn build` / `npm run build` - Compile TypeScript to `dist/`
- `yarn start` / `npm start` - Run compiled server

---

## Development Notes

- **Do not commit sensitive files:** `.env`, `google-cloud-key.json`, and `logs/` are gitignored.
- **Email templates:** Located in `src/templates/email/`. Use `{{variable}}` syntax for dynamic values.
- **Adding modules:** Use `module-create.sh` to scaffold new modules.
- **Logging:** All requests and errors are logged to `logs/` and rotated automatically.
- **API base path:** All routes are prefixed with `/api/v1`.

---

## Troubleshooting

- **MongoDB/Redis connection errors:** Check your `.env` values and ensure services are running.
- **Google Cloud errors:** Ensure `google-cloud-key.json` is present and valid, and bucket exists.
- **SMTP errors:** Verify SMTP credentials and network access.
- **CORS issues:** Update allowed origins in `src/server.ts` and `.env` as needed.

---

## License

MIT