# balance-statistic

### MongoDB
In order to create the validation rules in MongoDB, execute:

`mongosh -f createMongoDB.js`

The file createMongoDB.js can be found in the database directory.

### Backend & Frontend
Install all required npm packages with
`npm install`
in the backend and frontend directories respectively.

### Port Configs
In case ports 8080 and 4200 are already in use on your system,
you can change the ports.

For the API (which uses port 8080), the .env file in the backend directory
contains the port in the **SERVER_PORT** variable.

**It is important to note, that if you change the API port you also need to change the
port in the environment files for the frontend!**

The files are located in ./frontend/src/environments/*

To change the Frontend port, add `--port <Port number>` after `ng serve` in the
npm start script config the package.json.

### Run API and Frontend
Run `npm start` in the backend and frontend directories respectively.

