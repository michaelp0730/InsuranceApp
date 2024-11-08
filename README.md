# InsuranceApp

This is a Node.js project that includes a RESTful API to manage insurance applications. The API uses a MySQL database to store data related to insurance applications. This guide will help you set up the InsuranceApp database, Node.js sever, and React client.

## Table of Contents

- [Prerequisites](#prerequisites)
- [MySQL](#mysql-database)
  - [Setting Up the Database](#setting-up-the-database)
    - [Step 1: Log in to MySQL](#step-1-log-in-to-mysql)
    - [Step 2: Create the Database](#step-2-create-the-database)
    - [Step 3: Use the Database](#step-3-use-the-database)
    - [Step 4: Create the Database Tables](#step-4-create-the-database-tables)
  - [Starting MySQL](#starting-mysql)
    - [Mac](#mac-1)
    - [Windows](#windows-1)
    - [Linux](#linux-1)
- [Node Server](#node-server)
  - [Clone the Repository](#clone-the-repository)
  - [Install Server Dependencies](#install-server-dependencies)
  - [Environment Variables](#environment-variables)
  - [CORS Configuration](#cors-configuration)
  - [Starting the Server](#starting-the-server)
  - [Running Tests](#running-tests)
- [React Client](#react-client)
  - [Install Client Dependencies](#install-client-dependencies)
  - [Running the Client Project](#running-the-client-project)
  - [Building the Client Project](#building-the-client-project)
  - [Saving an Application Form](#saving-an-application)
- [Project Structure](#project-structure)

## Prerequisites

- Node.js (v18 or above recommended)
- NPM
- MySQL installed on your system

## MySQL Database

### Setting Up the Database

Once MySQL is installed and running, follow these steps to create the `InsuranceApp` database and the necessary tables.

#### Step 1: Log in to MySQL

Open a terminal and log in as the root user (or another user with administrative privileges):

```
mysql -u root -p
```

Enter your MySQL root password when prompted.

#### Step 2: Create the Database

```sql
CREATE DATABASE InsuranceApp;
```

#### Step 3: Use the Database

```sql
USE InsuranceApp
```

#### Step 4: Create the Database Tables

```sql
CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  applicationId VARCHAR(36) NOT NULL UNIQUE,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  dateOfBirth DATE NOT NULL,
  addressStreet VARCHAR(100),
  addressCity VARCHAR(50),
  addressState VARCHAR(50),
  addressZipCode INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE people (
  id INT AUTO_INCREMENT PRIMARY KEY,
  applicationId VARCHAR(36) NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  dateOfBirth DATE NOT NULL,
  relationship VARCHAR(50),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (applicationId) REFERENCES applications(applicationId) ON DELETE CASCADE
);

CREATE TABLE vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  applicationId VARCHAR(36) NOT NULL,
  vin VARCHAR(17) NOT NULL,
  year INT NOT NULL,
  makeModel VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (applicationId) REFERENCES applications(applicationId) ON DELETE CASCADE
);
```

### Starting MySQL

#### Mac

```
brew services start mysql
```

#### Windows

Use the MySQL service manager or run:

```
net start MySQL
```

#### Linux

```
sudo systemctl start mysql
```

## Node Server

### Clone the Repository

```
git clone https://github.com/michaelp0730/InsuranceApp
cd InsuranceApp/server/
```

### Install Server Dependencies

Run `npm install` in the command line from the `server` directory to install all required packages.

### Environment Variables

To configure your database connection securely, you need to create a `.env` file in the root of the `sever` directory.

```
DB_HOST=localhost          # The hostname of your database server
DB_USER=root               # Your MySQL username
DB_PASSWORD=yourpassword   # Your MySQL password
DB_NAME=InsuranceApp       # The name of your MySQL database
```

### CORS Configuration

The Node server has CORS configured to accept traffic from http://localhost:5173.
The React client is built with Vite, which typically runs on port 5173. If your client is running on a different port, you will need to modify this line in `server.ts` to allow the port your client is running on.

```
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
```

### Starting the Server

To start the server in development mode:

```
npm start
```

- This will use tsc-watch to compile the TypeScript code and run the server automatically.
- The server will restart automatically whenever you make code changes

To build the project and run it in production mode:

```
npm run build    # Compiles TypeScript to JavaScript and creates the `dist` folder
node dist/server.js
```

- The `build` script compiles the TypeScript code into JavaScript and places it in the `dist` directory.
- The `node dist/server.js` command runs the compiled JavaScript code.

### Running Tests

The project uses Jest for unit testing. Here's how to run the tests:

```
npm test
```

- This will execute all the Jest tests in the project and output the results to the console.

## React Client

### Install Client Dependencies

Run `npm install` in the command line from the root of the `client` directory to install all required packages.

### Running the Client Project

Run the following command from the root of the `client` directory, then visit the listed URL in your browser.

```
npm run dev
```

### Building the Client Project

```
npm run build
```

### Saving an Application Form

The minimum amount of information required to save an application is the first name, last name, and date of birth for the primary applicant. If you try to save an application form without those minimum fields being entered, you will receive an error message.

## Project Structure

- client
  - src/: Contains the main client application code, including components, interfaces, and utility functions.
- server
  - src/: Contains the main server application code, including interfaces, validators, routes, utility functions, and unit tests.
  - dist/: The compiled JavaScript output (generated after running `npm run build`).
