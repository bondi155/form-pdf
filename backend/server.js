require('dotenv').config();
const helmet = require('helmet');
const multer = require('multer');
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 5022;
const bodyParser = require('body-parser');
const cors = require('cors');
const getDataController = require('./Controllers/GetFuncData');
const PostDataController = require('./Controllers/PostFuncData');
const reportPdfController = require('./Controllers/ReportsPdf');
//const mysql = require('mysql2');
const excelController = require('./Controllers/EvaluationsXlsx');
const {EmailFunctions} = require ('./Controllers/EmailCalif');
//multer
const upload = multer({ dest: 'uploads/' });
const jwt = require('jsonwebtoken');
const secretkey = process.env.JWT_SECRET;
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // se pueden poner mas
      },
    },
    // configuraciones predeterminadas que Helmet aplica
    expectCt: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    xssFilter: true,
    dnsPrefetchControl: {
      allow: false, // a `true` para permitir el prefetching de DNS
    },
    permittedCrossDomainPolicies: {
      permittedPolicies: 'none',
    },
    referrerPolicy: {
      policy: 'no-referrer',
    },
  })
);

// Encabezados de seguridad manuales
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
  next();
});

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

 //get personal data with join
app.get(
  '/getDataEvaluations',
  authenticateToken,
  getDataController.consultaEvalData__
); //get evaluation data in data-grid

//all companies for admin
app.post('/loginUsers', authenticateToken, getDataController.loginUsers__); //login
app.get('/getUserList', authenticateToken, getDataController.listUsers__); //get user for list

//post y put functions
app.put('/editCalif', authenticateToken, PostDataController.editCalif__); //Edit Calification in data grid evaluation page (admin)
app.put('/updateComment', authenticateToken, PostDataController.comments__); //update comment personal_Data
app.put('/updateUrlpd/:id', authenticateToken, PostDataController.reportUrlpd__); //update comment personal_Data

app.put('/reportUrl/:id', authenticateToken, PostDataController.reportUrl__); //subir url en data grid del google drive
app.post('/createUser', authenticateToken, PostDataController.userCreate__); //creation of users
app.post('/fillPdf', authenticateToken, reportPdfController.reportCardFill__); //creation of users

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

//email sender
app.get('/sendEmails', authenticateToken, async (req, res) => {
  try {
    const mes = req.query.mes;
    const anio = `%${req.query.anio}`;
    console.log('estos son los vars',mes, anio)
    await EmailFunctions(mes, anio);
    res.status(200).send('Correos enviados con éxito');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al enviar los correos');
  }
});


// Ruta para el manejo del archivo Excel
app.post(
  '/uploadfile',
  authenticateToken,
  upload.single('file'),
  excelController.EvaluationsXlsx
);


//ruta descargar report card
app.get('/download/:filename', authenticateToken, getDataController.download__); //download file cancell

app.listen(port, () => {
  console.log('servidor funcionando en el puerto ' + port);
});
