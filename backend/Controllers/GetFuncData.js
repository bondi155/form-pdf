//const db = require('../Config/dbConfig'); local para pruebas
require('dotenv').config();
const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretkey = process.env.JWT_SECRET;
const path = require('path');

//evaluation data select
function consultaEvalData__(req, res) {
  const sqlGetEvalData = `
  SELECT ed.*, rc.profile
  FROM evaluation_data ed
  LEFT JOIN report_cards rc ON ed.company_email = rc.company_email
  ORDER BY ed.id DESC;
`;

  pool.query(sqlGetEvalData, (err, result) => {
    if (err) {
      console.error(
        'Error executing query sqlGetEvalData..Check DB connection',
        err
      );
      return res.status(500).send('Error to get Evaluation data');
    }
    res.send(result);
  });
}

//get list users.
function listUsers__(req, res) {
  const sqlGetusuarios = 'SELECT * FROM users ';
  pool.query(sqlGetusuarios, (error, result) => {
    if (error) {
      console.error('Error in query listUsers...Check DB connection', error);
    } else {
      const userList = result.map((row) => ({
        id: row.id,
        user: row.username,
        role: row.role,
      }));
      res.send(userList);
    }
  });
}

//func para validar usuarios , executamos eso esto en terminal para generar el key = node -e "console.log(require('crypto').randomBytes(256).toString('base64'))
function loginUsers__(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const selectLogin = 'SELECT * FROM users WHERE username = ?';

  pool.query(selectLogin, [username], (err, result) => {
    if (err) {
      console.error('Error in connection to DB to check bcrypt password', err);
      res
        .status(500)
        .send('Error al realizar la conexion bd para bcrypt password');
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (err, response) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error to compare encrypt password');
        } else if (response) {
          const token = jwt.sign({ id: result[0].id }, secretkey, {
            expiresIn: '1h',
          });
          res.send({
            token,
            id: result[0].id,
            username: result[0].username,
            role: result[0].role,
          });
          console.log('Loggin user...', username);
        } else {
          res.send({ code: 'USR_INCOR' });
        }
      });
    } else {
      res.send({ code: 'USR_NOT_EXIST' });
    }
  });
}

//descarga de archivo
function download__(req, res) {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'reports', filename);
    res.download(filepath);
  } catch (error) {
    console.error('Error downloading report...', error);
  }
}

module.exports = {
  consultaEvalData__,
  loginUsers__,
  listUsers__,
  download__,
};
