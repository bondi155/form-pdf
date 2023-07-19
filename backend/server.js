require('dotenv').config();
const multer = require('multer');
const express = require('express');
const app = express();
const port = process.env.PORT || 5015;
const bodyParser = require('body-parser');
const cors = require('cors');
const getDataController = require('./Controllers/GetFuncData');
const PostDataController = require ('./Controllers/PostFuncData');
//const mysql = require('mysql2');
const { authorize, listMajors } = require('./Controllers/FormApi');
const excelController = require('./Controllers/EvaluationsXlsx');
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/getPersonalData', getDataController.consultaData__);//get personal data with join 
app.get('/getDataEvaluations', getDataController.consultaEvalData__);//get evaluation data in data-grid
app.get('/suggestNames', getDataController.autocompleteName);//suggest list of names
app.post('/loginUsers', getDataController.loginUsers__);//login 
app.get('/getUserList', getDataController.listUsers__);//get user for list
app.post('/createUser', PostDataController.userCreate__);//creation of users
app.delete('/deleteUser/:id', PostDataController.deleteUser__); //delete user by id
app.delete('/deleteEvaluation/:id', PostDataController.deleteEvaluation__); //delete evaluation by id


//get sheet data with validation 
app.get('/getDataSheets', async (req, res) => {
  try {
    const auth = await authorize();
    const {insertedEmails, duplicatedState} = await listMajors(auth, req);
if (duplicatedState){
  res
  .status(200)
  .json({ 
    code:'DUPLICATED', 
    message:'Success getting Data from sheet (You have duplicated rows, dont worry it were not inserted)',
    emails: insertedEmails
    
  });

}else {
  res
      .status(200)
      .json({ 
        code:'INSERT_OKAY', 
        message:'Success getting Data from sheet',
        emails: insertedEmails
        
      });
   }
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocurrió un error al obtener los datos');
  }
});
// Ruta para el manejo del archivo Excel
app.post('/uploadfile', upload.single('file'), excelController.EvaluationsXlsx);

app.listen(port, () => {
  console.log('servidor funcionando en el puerto ' + port);
});
