require('dotenv').config();
const helmet = require('helmet');
const multer = require('multer');
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 5015;
const bodyParser = require('body-parser');
const cors = require('cors');
const getDataController = require('./Controllers/GetFuncData');
const PostDataController = require('./Controllers/PostFuncData');
//const mysql = require('mysql2');
const { authorize, listMajors } = require('./Controllers/FormApi');
const { authorizeDrive, listFiles } = require('./Controllers/DriveApi');
const excelController = require('./Controllers/EvaluationsXlsx');
//multer
const upload = multer({ dest: 'uploads/' });
//multer storage para el report pdf
/*const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'reports/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadPdf = multer({ storage: storage });
//termina multer
*/
const jwt = require('jsonwebtoken');
const secretkey = process.env.JWT_SECRET;
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//validacion del token como encabezado en todas las llamadas de api
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (req.path === '/loginUsers') {
    // Si es la ruta de generación del token, continuar sin verificar el token
    next();
  } else {
    // Verificar el token en todas las demás rutas
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretkey, (err, user) => {
      if (err) return res.status(403).send();
      req.user = user;
      next();
    });
  }
}
//limitador de tasa contra ddos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limita cada ip a 100 request
});

//limitador de tasa a todas las rutas
app.use(limiter);

app.use(cors());
app.use(express.json());
app.get(
  '/getPersonalData',
  authenticateToken,
  getDataController.consultaData__
); //get personal data with join
app.get(
  '/getDataEvaluations',
  authenticateToken,
  getDataController.consultaEvalData__
); //get evaluation data in data-grid
app.get('/suggestNames', authenticateToken, getDataController.autocompleteName); //suggest list of names
app.get('/getCompanies', authenticateToken, getDataController.getAllCompanies__); //all companies for admin
app.get('/examData', authenticateToken, getDataController.getExamData__); //info graficos 
app.post('/loginUsers', authenticateToken, getDataController.loginUsers__); //login
app.get('/companyEval', authenticateToken, getDataController.EvalCompany__); //get evaluation by company
app.get('/getUserList', authenticateToken, getDataController.listUsers__); //get user for list
app.post('/createUser', authenticateToken, PostDataController.userCreate__); //creation of users
app.put('/updateComment', authenticateToken, PostDataController.comments__); //update comment personal_Data
app.put('/reportUrl/:id', authenticateToken, PostDataController.reportUrl__); //subir url en data grid del google drive

app.delete(
  '/deleteUser/:id',
  authenticateToken,
  PostDataController.deleteUser__
); //delete user by id
app.delete(
  '/deleteEvaluation/:id',
  authenticateToken,
  PostDataController.deleteEvaluation__
); //delete evaluation by id

//get de drive api
app.get('/googleDrive', authenticateToken, async (req, res) => {
  try {
    const searchInput = req.query.searchInput ?? '';
    const authDrive = await authorizeDrive();
    const files = await listFiles(authDrive, req, res);
    if (files && files.length > 0) {
      const messageRes = {
        message: 'Success getting list files from Google Drive Api',
        searchInput,
      };
      res.status(200).json({
        messageRes,
        code: 'SUCCESS',
        list: files,
      });
      console.log(messageRes);
    } else {
      res.status(500).json({
        message: 'ERROR getting data from drive',
        code: 'ERROR_CONN_FILES',
        list: [],
      });
    }
  } catch (err) {
    console.error('error in Google Drive Api Comunication', err);
  }
});
//get sheet data with validation
app.get('/getDataSheets', authenticateToken, async (req, res) => {
  try {
    const auth = await authorize();
    const { insertedEmails, duplicatedState } = await listMajors(auth, req);
    if (duplicatedState) {
      res.status(200).json({
        code: 'DUPLICATED',
        message:
          'Success getting Data from sheet (You have duplicated rows, dont worry it were not inserted)',
        emails: insertedEmails,
      });
    } else {
      res.status(200).json({
        code: 'INSERT_OKAY',
        message: 'Success getting Data from sheet',
        emails: insertedEmails,
      });
    }
  } catch (error) {
    console.error('Error in google sheets Api', error);
    res.status(500).send('Error getting data from Google Sheets Api', error);
  }
});
// Ruta para el manejo del archivo Excel
app.post(
  '/uploadfile',
  authenticateToken,
  upload.single('file'),
  excelController.EvaluationsXlsx
);

/* 
//ruta para subir reportcard a cada id especifico
  app.use('/reports', express.static('./reports'));

  app.post(
    '/uploadReport/:id',
    authenticateToken,
    uploadPdf.single('file'),
    PostDataController.reportPdf__
  );
  */
//ruta descargar report card
app.get('/download/:filename', authenticateToken, getDataController.download__); //download file cancell

app.listen(port, () => {
  console.log('servidor funcionando en el puerto ' + port);
});
