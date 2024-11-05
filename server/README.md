# InsuranceApp

This is a Node.js project that includes a RESTful API to manage insurance applications. The API will use a MySQL database to store data related to insurance applications. This guide will help you set up the InsuranceApp Node.js project, install dependencies, start the server, and run tests.

## Table of Contents

- [Prerequisites](#prerequisites)
- [MySQL](#mysql-database)
  - [Installation Instructions for MySQL](#installation-instructions-for-mysql)
    - [Mac](#mac)
    - [Windows](#windows)
    - [Linux](#linux)
  - [Setting Up the Database](#setting-up-the-database)
    - [Step 1: Log in to MySQL](#step-1-log-in-to-mysql)
    - [Step 2: Create the Database](#step-2-create-the-database)
    - [Step 3: Use the Database](#step-3-use-the-database)
    - [Step 4: Create the Database Tables](#step-4-create-the-database-tables)
  - [Starting MySQL](#starting-mysql)
    - [Mac](#mac-1)
    - [Windows](#windows-1)
    - [Linux](#linux-1)
  - [Environment Variables](#environment-variables)
- [Node Server](#node-server)
  - [Clone the Repository](#clone-the-repository)
  - [Install Server Dependencies](#install-server-dependencies)
  - [Starting the Server](#starting-the-server)
  - [Running Tests](#running-tests)
    - [Run All Tests](#run-all-tests)
- [React Client](#react-client)
  - [Install Client Dependencies](#install-client-dependencies)
  - [Running the Client Project](#running-the-client-project)
  - [Building the Client Project](#building-the-client-project)
- [Project Structure](#project-structure)

## Prerequisites

- Node.js (v18 or above recommended)
- MySQL installed on your system

## MySQL Database

### Installation Instructions

#### Mac

##### Using Homebrew:

```
brew install mysql
```

##### Start MySQL

```
brew services start mysql
```

##### Secure MySQL Installation

```
mysql_secure_installation
```

#### Windows

1. Download the MySQL installer from the [official MySQL website](https://dev.mysql.com/downloads/installer/).
1. Run the installer and follow the setup wizard.
1. Choose the "Developer Default" setup type.
1. Complete the installation and make note of the root password you set.
1. Start MySQL
   - Open MySQL from the Start Menu or use the `mysql` command in your terminal.

#### Linux

##### Using APT (Ubuntu/Debian):

```
sudo apt update
sudo apt install mysql-server
```

##### Secure MySQL Installation

```
sudo mysql_secure_installation
```

##### Start MySQL

```
sudo systemctl start mysql
```

### Setting Up the Database

Once MySQL is installed and running, follow these steps to create the `InsuranceApp` database and the `applications` table.

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
-- Applications table
CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  applicationId VARCHAR(36) NOT NULL UNIQUE,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  dateOfBirth DATE NOT NULL,
  addressStreet VARCHAR(100) NOT NULL,
  addressCity VARCHAR(50) NOT NULL,
  addressState VARCHAR(50) NOT NULL,
  addressZipCode INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- People table
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

-- Vehicles table
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

### Environment Variables

To configure your database connection securely, you need to create a `.env` file in the root of the project.

```
DB_HOST=localhost          # The hostname of your database server
DB_USER=root               # Your MySQL username
DB_PASSWORD=yourpassword   # Your MySQL password
DB_NAME=InsuranceApp       # The name of your MySQL database
```

## Node Server

### Clone the Repository

```
git clone https://github.com/michaelp0730/InsuranceApp
cd InsuranceApp/server/
```

### Install Server Dependencies

Run the following command in the `server` directory to install all required packages:

```
npm install
```

This command will read the `package.json` file and install all the dependencies listed under `dependencies` and `devDependencies`.

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

#### Run All Tests

```
npm test
```

- This will execute all the Jest tests in the project and output the results to the console.

## React Client

### Install Client Dependencies

Run the following command from the root of the `client` directory to install all required packages:

```
npm install
```

This command will read the `package.json` file and install all the dependencies listed under `dependencies` and `devDependencies`.

### Running the Client Project

Run the following command from the root of the `client` directory, then visit the listed URL in your browser.

```
npm run dev
```

### Building the Client Project

```
npm run build
```

### Project Structure

- client
  - src/: Contains the main client application code, including components, interfaces, and utility functions.
- server
  - src/: Contains the main server application code, including interfaces, validators, routes, utility functions, and unit tests.
  - dist/: The compiled JavaScript output (generated after running `npm run build`).
