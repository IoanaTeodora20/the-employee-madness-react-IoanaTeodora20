# The Employee Madness

## Description

The Employee Madness is a MERN stack application based on an employee registration system.

Features:

- Users can alphabetically sort the employees based on their names;
- Users can filter the employees based on their Level, Position, or both;
- Users can search for an employee based on his/her name;
- Users can tick an employee, and then access all the employees with the same level and position as him/her;
- Users can clear all filters;
- Users can tick the employees present, and then access a table with all the missing employees;
- Users can create new employees;
- Users can access an Equipments table;
- Users can create new equipments;
- When creating a new employee, depending on his/her Level, they can have a color added into the database as well;
- Employees have companies they previously worked for;
- Users can create new companies into the database;
- Users can update and delete employees/equipments.

## Installation

## Server Side

### Install dependencies

```bash
cd ./server
npm install
```

### .env file

Copy the .env.sample as .env and fill up the environment variable for your personal mongodb connecttion url.

### Prepare the database

```bash
cd ./server
npm run populate
```

**populate command** will run the populate.js file as a script and it will generate a buch of starter data for your database.

### Running the code

```bash
cd ./server
npm run dev
```

It will start the server with nodemon. So it will watch the changes and restart the server if some ot the files changed.

## Client Side

### Install dependencies

```bash
cd ./client
npm install
```

### Proxy

Watch for the port of your rest api. By default it will bind on port 8080 and the frontend proxy settings also depend on this configuration. If you for some reasons change the port of the backend, don't forget to change the ./client/package.json proxy settings as well.

### Runnig the code

```bash
cd ./client
npm start
```

And the create-react-app react-scripts package will start your frontend on the 3000 port and you can visit the http://localhost:3000 on your preferred browser.

## Visuals
