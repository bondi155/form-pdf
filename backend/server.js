require('dotenv').config();
const express = require("express");
const app = express();
const port =  process.env.PORT || 5015;
const bodyParser = require("body-parser");
const cors = require("cors");
const postDataController = require('./Controllers/GetFuncData')
const getGoogle =  require ('./Controllers/FormApi');


app.use(cors());
app.use(express.json());
//app.use(fileupload());
//app.use(express.static("files"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/getPersonalData",postDataController.consultaData__ );

//app.get("/getform",getGoogle.getGoogleForms);

const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')
connection.end()


app.listen(port, () => {
    console.log("servidor funcionando en el puerto " + port );
  });