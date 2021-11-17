# RiskManagementDocumentRepo
 An application to upload and manage documentation surrounding specific legal risk requirements.

# Implementation Guide

## Prerequisites

- mongoDB 
- NodeJS
- MongoDBCompass (optional)

## Instructions 

1. Clone the repo
2. If it is not already, boot your mongo server on the default port 27017
3. Run the SetupDB.mongodb script against your database. (I used the visual studio extention MongoDB for VS Code for this found here: https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode)
4. Validate it ran by checking that the "RiskManagmentDocumentRepo" database, the documents and users collections in that database and the "adminUser" in the "users" collection has been added. I reccomend using mongoDBCompass for this step
5. Open a terminal and navigate to the root of the project.
6. From there cd to Frontend\risk-management-document-repo and backend in the terminal and run npm install in both of these folders and wait for the installs to complete. This installs all relevant node packages
7. Then run both the launchBackend.bat and launchFrontend.bat files in order to launch both the frontend and backend  
7.a If there is an TextEncoder is not defined error when running the backend do the following  
7.b Locate the following file \Backend\node_modules\whatwg-url\dist\encoding.js  
7.c add const {TextEncoder, TextDecoder} = require("util") to the top of the file
8. The application should run fine now providing your database, backend and frontend are all running as I have specified. 

## Running unit test

My unit tests have one prerequisite to running, a manual test that needs to be performed before running. The way I do this is through postman by setting up as shown in the below picture 
![alt text](https://github.com/RussianHamster6/RiskManagementDocumentRepo/blob/main/Backend/testStuff/DocumentAddExample.png)

Following that running npm test in the backend folder will run the unit tests for the backend.

Additionally there is a cleanup script to run following test completion, this is run by running node testCleanup.js in the backend folder 
