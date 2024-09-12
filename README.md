# JPress

Welcome to the JPress repository! This project provides backend services for a job matching application, featuring user management, chat, notifications, offers, recommendations, and feedback for both clients and applicants.

## Features

- **User Management**: Manage roles for clients and applicants.
- **Chat System**: One-on-one messaging and video calls between users.
- **Notifications**: Real-time updates and alerts.
- **Service Requests & Offers**: Clients post requests and view offers from applicants.
- **Recommendations**: Suggest applicants based on requests.
- **Feedback System**: Clients rate and review service providers.

## Technology Stack

- **Languages**: TypeScript / Node.js / JavaScript
- **Database**: MongoDB
- **Framework**: Express
- **Tools**: Swagger (API docs), Jest (unit testing), Socket.io, Passport, JWT

## Getting Started

### Prerequisites

- Node.js / NPM
- MongoDB instance

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/JPress-IEEE/Backend.git
    cd Backend
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:  
   Create a `.env` file with:
    ```plaintext
    MONGO_URI=
    PUBLIC_KEY=""
    PRIVATE_KEY=""
    ACCESS_KEY_TTL=""
    REFRESH_KEY_TTL=""
    NODE_ENV=
    PORT=
    SALT_WORK_FACTOR=
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    FACEBOOK_APP_ID=
    FACEBOOK_APP_SECRET=
    LINKEDIN_CLIENT_ID=
    LINKEDIN_CLIENT_SECRET=
    EMAIL_USER=
    EMAIL_PASS=
    EMAIL_SECRET=
    SESSION_SECRET=
    ```

4. **Build and Start the Server**:
    ```bash
    npm run build
    npm run start
    ```

### Testing

- **Run All Tests**:
    ```bash
    npm run test
    ```

- **Run Specific Tests**:
    ```bash
    npm test -- <path-to-test-file>
    ```

- **Test Coverage Report**:
    ```bash
    npm run test:coverage
    ```

- **Debugging (Watch Mode)**:
    ```bash
    npm test -- --watch
    ```

### API Documentation

Access Swagger documentation at:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Contributing

We welcome contributions to JPress:

1. **Fork the Repository**: Create a personal copy on GitHub.
2. **Create a Branch**: Develop features or fixes in a new branch.
3. **Commit Changes**: Write clear and detailed commit messages.
4. **Submit a Pull Request**: Provide a clear description of the changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
