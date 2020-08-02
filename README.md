### Homework Employee Tracker using MySQL
## For this project i'm using
MySQL

Inquirer

Console.table

Command line application that allows:


# Instillation
To ensure the tracker operates, the user will need to run npm install to make sure the necessary modules are installed (mysql and inquirer). The user will also have to make sure the database is up and running to allow access and the credentials within the "connection" variable (in the app.js file) is correct. Once everything is set up simply enter "npm run start" in the terminal to start the tracker

# Usage
When running the application within the terminal, make sure to follow the steps displayed. When the application is run, the user will be presented with a list of different actionable commands (see image 1) that the they will be able to scroll through.

## Done
Set up folder structure
Installed Express, Inquirer and MySQL
Changed the script to run node using npm run
Installed Path
Installed node
Test created a database using MySQL Workbench
Added a seed.sql database
Got it to render from database

# Employee Tracker Database
This node command line interface (CLI) allows users to access a sql database to edit and bring up lists of employee and their information based on selected criteria, similar to a content management system (CMS). This is done through inquirer for the CMS interface with a connection through MySQL to perform CRUD functionalities (create, read, update, and delete)

# commands include:

View all employees - 
View employees by department 
View employees by role
View employees by manager 
a department -
Add employee - 
Add department - 
Add role - 
Remove employee - 
Remove role - 
Remove department -
Update employee role - 
Update employee manager -
End application -
