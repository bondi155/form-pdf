require('dotenv').config();
const multer = require('multer');
const express = require('express');
const app = express();
const port = process.env.PORT || 5015;
const bodyParser = require('body-parser');
const cors = require('cors');
const getDataController = require('./Controllers/GetFuncData');
//const mysql = require('mysql2');
const { authorize, listMajors } = require('./Controllers/FormApi');
const excelController = require('./Controllers/EvaluationsXlsx');
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para el manejo del info de personal data en base de datos
app.get('/getPersonalData', getDataController.consultaData__);

// Ruta para el manejo del info de personal data en base de datos
app.get('/getDataEvaluations', getDataController.consultaEvalData__);

// Ruta para el manejo de informacion de sheets
app.get('/getDataSheets', async (req, res) => {
  try {
    const auth = await authorize();
    const insertedEmails = await listMajors(auth, req);
    res
      .status(200)
      .json({ 
        code:'INSERT_OKAY', message:`Success getting Data from sheet ${insertedEmails}`
      });
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
