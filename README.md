# Content Sharing Platform

This is a place for Just Another Sand Game players to share maps, mods, and more!

![image](https://github.com/KINGTUT10101/ContentSharingPlatform/assets/45105509/263ee045-e2d6-4a5d-ab4d-51ad3e79d488)
![image](https://github.com/KINGTUT10101/ContentSharingPlatform/assets/45105509/0a364dc3-a281-4fad-94ca-26c351c80daa)
![image](https://github.com/KINGTUT10101/ContentSharingPlatform/assets/45105509/cdd0823d-e315-4501-bdfe-878f854c2c30)

## Documentation

https://kingtut10101.github.io/ContentSharingPlatform/

# Setup Databases and Upload Mock Data

Make sure you have pgSQL and MongoDBCompass installed

## SQL

Connect to the SQL Shell (psql)

Run "CREATE DATABASE <Database>;", replacing <Database> with whatever you want to name your Database

Run "\c <Database>"

Run "\i <path/to/PostgreSQL_Project.sql>"

Run "\copy useraccount FROM '<path/to/ContentSharingPlatform/database/mockData/UserAcct.csv>' WITH DELIMITER ',' CSV HEADER;"

Run "\copy comment(UserEmail,CommentText,CreationDate,ContentId) FROM '<path/to/Comment.csv>' WITH DELIMITER ',' CSV HEADER;"

Run "\copy rating FROM '<path/to/Ranking.csv>' WITH DELIMITER ',' CSV HEADER;"

Navigate to ContentSharingPlatform/server/db/sqlConn.js

Change user, host, database, password, and port to your chosen SQL database settings

## MongoDB

Connect to MongoDBCompass

Create Database and Collection titled "Content"

Click ADD DATA > Import JSON or CSV file

Navigate to ContentSharingPlatform/database/mockData/Content.json

Click Import

Navigate to ContentSharingPlatform/server/db/mongoConn.js

Change "connectionString" to your chosen MongoDB connection string if needed

Change "let db = conn.db("<Database>")" to your database name


# Installation

Make sure [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) is installed

Run “git clone [https://github.com/KINGTUT10101/ContentSharingPlatform.git”](https://github.com/KINGTUT10101/ContentSharingPlatform.git”)

Run “cd ContentSharingPlatform”

Run “npm install”

Run “cd client”

Run "npm install" again

Run "cd ../server"

Run "npm install" one last time

## Running the project

Run “npm run dev” in the project's root directory

Connect to localhost:3000 in your browser

## Running the frontend

Run “npm run client” in the project's root directory

Connect to localhost:3000 in your browser

## Building the frontend

(It's recommended that you do this before running the backend. This will update the static frontend files that the backend will return to you)

Run "npm run build" in the project's root directory

## Running the backend

Run “npm run server” in the project's root directory

Connect to localhost:5000 in your browser
