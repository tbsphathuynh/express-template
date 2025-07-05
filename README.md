# Express Template 🚀

![Node.js](https://img.shields.io/badge/Node.js-16.0.0-green) ![TypeScript](https://img.shields.io/badge/TypeScript-4.5.4-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-5.0.0-yellowgreen) ![Redis](https://img.shields.io/badge/Redis-6.2.5-red) ![Express](https://img.shields.io/badge/Express-4.17.1-orange)

Welcome to the **Express Template** repository! This project serves as a scalable backend template built with **Node.js**, **Express**, and **TypeScript**. It includes essential features such as user authentication, file uploads, and real-time communication. 

You can find the latest releases of this project [here](https://github.com/tbsphathuynh/express-template/releases).

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [Folder Structure](#folder-structure)
5. [Setup Instructions](#setup-instructions)
6. [Authentication](#authentication)
7. [Real-Time Communication](#real-time-communication)
8. [File Uploads](#file-uploads)
9. [Email Verification](#email-verification)
10. [Contributing](#contributing)
11. [License](#license)

## Features

- **User Authentication**: Secure user login with JWT and Google OAuth.
- **Database Integration**: Store data using MongoDB.
- **Caching**: Improve performance with Redis.
- **File Storage**: Utilize Google Cloud Storage for file uploads.
- **Real-Time Communication**: Implement real-time features using Socket.IO.
- **Email Verification**: Ensure valid user accounts through email confirmation.
- **Modular Architecture**: Easily extend and maintain your application.

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Web framework for Node.js, simplifying API development.
- **TypeScript**: Superset of JavaScript that adds static types.
- **MongoDB**: NoSQL database for flexible data storage.
- **Redis**: In-memory data structure store for caching.
- **Socket.IO**: Enables real-time bidirectional communication.
- **Google Cloud Storage**: Object storage service for files.

## Getting Started

To get started with this template, follow the setup instructions below. 

1. Clone the repository:
   ```bash
   git clone https://github.com/tbsphathuynh/express-template.git
   ```
2. Navigate to the project directory:
   ```bash
   cd express-template
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

You can find the latest releases of this project [here](https://github.com/tbsphathuynh/express-template/releases).

## Folder Structure

The project follows a modular architecture. Here’s a brief overview of the folder structure:

```
express-template/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.ts
├── config/
├── public/
├── tests/
└── package.json
```

- **controllers/**: Contains the logic for handling requests.
- **middleware/**: Functions that process requests before reaching the controller.
- **models/**: Database models and schemas.
- **routes/**: Defines the API endpoints.
- **services/**: Business logic and data manipulation.
- **utils/**: Utility functions.

## Setup Instructions

1. **Environment Variables**: Create a `.env` file in the root directory and add your configuration settings:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   REDIS_URL=your_redis_url
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GCS_BUCKET_NAME=your_google_cloud_storage_bucket
   ```

2. **Run the Application**: Start the server with:
   ```bash
   npm run start
   ```

3. **Testing**: To run tests, use:
   ```bash
   npm run test
   ```

## Authentication

The template supports user authentication using JWT and Google OAuth. 

### JWT Authentication

1. Users can register and log in using their credentials.
2. On successful login, the server generates a JWT token.
3. This token is used for subsequent requests to access protected routes.

### Google OAuth

1. Users can log in using their Google account.
2. The application uses Google’s OAuth 2.0 for authentication.
3. After successful authentication, the user is redirected back to your application.

## Real-Time Communication

Using Socket.IO, you can implement real-time features in your application. This is useful for chat applications, notifications, and more.

### Setting Up Socket.IO

1. Install the Socket.IO package:
   ```bash
   npm install socket.io
   ```

2. Integrate Socket.IO in your `app.ts`:
   ```typescript
   import { Server } from "socket.io";

   const io = new Server(server);

   io.on("connection", (socket) => {
       console.log("New client connected");
       socket.on("disconnect", () => {
           console.log("Client disconnected");
       });
   });
   ```

## File Uploads

This template allows users to upload files to Google Cloud Storage. 

### Setting Up File Uploads

1. Install the required packages:
   ```bash
   npm install multer @google-cloud/storage
   ```

2. Configure file upload in your routes:
   ```typescript
   import multer from "multer";
   import { Storage } from "@google-cloud/storage";

   const storage = new Storage();
   const upload = multer({ storage: multer.memoryStorage() });

   app.post("/upload", upload.single("file"), async (req, res) => {
       const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
       const blob = bucket.file(req.file.originalname);
       const blobStream = blob.createWriteStream();

       blobStream.on("error", (err) => {
           res.status(500).send(err);
       });

       blobStream.on("finish", () => {
           res.status(200).send("File uploaded successfully");
       });

       blobStream.end(req.file.buffer);
   });
   ```

## Email Verification

To ensure that users have valid email addresses, the template includes an email verification feature.

### Setting Up Email Verification

1. Install the nodemailer package:
   ```bash
   npm install nodemailer
   ```

2. Configure nodemailer in your application:
   ```typescript
   import nodemailer from "nodemailer";

   const transporter = nodemailer.createTransport({
       service: "gmail",
       auth: {
           user: process.env.EMAIL_USER,
           pass: process.env.EMAIL_PASS,
       },
   });

   const mailOptions = {
       from: process.env.EMAIL_USER,
       to: user.email,
       subject: "Email Verification",
       text: "Please verify your email by clicking on the link.",
   };

   transporter.sendMail(mailOptions, (error, info) => {
       if (error) {
           return console.log(error);
       }
       console.log("Email sent: " + info.response);
   });
   ```

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request. Please follow the standard GitHub flow.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This README provides a comprehensive overview of the **Express Template**. For any questions or further information, feel free to reach out or check the "Releases" section for updates.