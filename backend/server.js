require('dotenv').config();
const helmet = require('helmet');
const multer = require('multer');
const express = require('express');
const rateLimit = require('express-rate-limit');
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
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
}
//limitador de tasa contra ddos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limita cada ip a 100 request
});

//limitador de tasa a todas las rutas
app.use(limiter);

app.use(cors());
app.use(express.json());
app.get('/getPersonalData',authenticateToken, getDataController.consultaData__);//get personal data with join 
app.get('/getDataEvaluations',authenticateToken, getDataController.consultaEvalData__);//get evaluation data in data-grid
app.get('/suggestNames', authenticateToken, getDataController.autocompleteName);//suggest list of names
app.post('/loginUsers', authenticateToken, getDataController.loginUsers__);//login 
app.get('/getUserList', authenticateToken, getDataController.listUsers__);//get user for list
app.post('/createUser', authenticateToken, PostDataController.userCreate__);//creation of users
app.delete('/deleteUser/:id', authenticateToken, PostDataController.deleteUser__); //delete user by id
app.delete('/deleteEvaluation/:id', authenticateToken, PostDataController.deleteEvaluation__); //delete evaluation by id

//get sheet data with validation 
app.get('/getDataSheets', authenticateToken, async (req, res) => {
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
app.post('/uploadfile', authenticateToken, upload.single('file'), excelController.EvaluationsXlsx);

app.listen(port, () => {
  console.log('servidor funcionando en el puerto ' + port);
});
