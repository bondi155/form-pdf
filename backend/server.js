const express = require("express");
const app = express();
const port = 5015;
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


app.listen(port, () => {
    console.log("servidor funcionando en el puerto " + port );
  });