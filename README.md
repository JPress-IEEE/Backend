# JPress

Welcome to the JPress repository! This project provides backend services for a job matching application, featuring user management, chat, notifications, offers, recommendations, and feedback for both clients and applicants.

## Features

- **User Management**: Manages different roles for clients and applicants.
- **Chat System**: Facilitates one-on-one messaging and video calls between users.
- **Notifications**: Delivers real-time updates and alerts.
- **Service Requests & Offers**: Lets clients post requests and view offers from applicants.
- **Recommendations**: Suggests applicants based on specific requests.
- **Feedback System**: Allows clients to rate and review service providers.

## Technology Stack

- **Language**: TypeScript / Node.js / JavaScript
- **Database**: MongoDB
- **Framework**: Express
- **Other Tools**: Swagger for API documentation, Jest for unit testing, Socket.io, Passport, JWT, etc.

## Getting Started

### Prerequisites

- Node.js / NPM
- A running instance of MongoDB

### Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/JPress-IEEE/Backend.git
    cd Backend
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Set Up Environment Variables:**

    Create a `.env` file in the root directory and add the following environment variables:

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

    Replace the placeholders with your actual configuration values.

4. **Start the Server:**

    ```bash
    npm run start
    ```

5. **Testing:**

    To ensure that JPress functions correctly and to maintain code quality, we use Jest for unit testing. Follow these steps to run and manage tests:

    - **Running Tests:** To run all unit tests, execute the following command:

      ```bash
      npm run test
      ```

    - **Running Specific Tests:** To run a specific test file or test suite, specify the file name:

      ```bash
      npm test -- <path-to-test-file>
      ```

    - **Coverage Report:** To generate a test coverage report, use:

      ```bash
      npm run test:coverage
      ```

    - **Writing Tests:** Place test files in the `__tests__` directory or name them with a `.test.js` or `.spec.js` suffix.

    - **Debugging Tests:** Run Jest in watch mode to debug failing tests:

      ```bash
      npm test -- --watch
      ```



### API Documentation

API documentation is provided using Swagger. Access it at:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Swagger offers interactive documentation to explore and test API endpoints.

## Contributing

We welcome contributions to JPress! To contribute:

1. **Fork the Repository:** Create a personal copy of the repository on GitHub.
2. **Create a Branch:** Develop your feature or fix in a new branch.
3. **Commit Your Changes:** Ensure your changes are well-documented in your commit messages.
4. **Submit a Pull Request:** Open a pull request with a clear description of your changes.



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

