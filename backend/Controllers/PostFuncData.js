const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const bcrypt = require('bcrypt');
const saltRounds = 10;
//user create
function userCreate__(req, res) {
  const username = req.body.username;
  const role = req.body.role;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    const sqlCreateUser =
      'INSERT INTO users (username, role, password ) VALUES (?,?,?)';

    pool.query(sqlCreateUser, [username, role, hash], (error, result) => {
      if (error) {
        console.log(error.code);

        if (error.code === 'ER_DUP_ENTRY') {
          res.status(500).json({
            code: 'USER_DUPLI',
            message: 'This user name already exists',
          });
        }
      } else {
        res.status(200).json('User create!');
      }
    });
  });
}

//delete user
function deleteUser__(req, res) {
  const id = req.params.id;

  const sqlDeleteUser = 'DELETE FROM users WHERE id = ?';

  pool.query(sqlDeleteUser, [id], (error, result) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: 'An error occurred while deleting the user' });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  });
}

//delete evaluation
function deleteEvaluation__(req, res) {
  const id = req.params.id;

  const sqlDeleteUser = 'DELETE FROM evaluation_data WHERE id = ?';

  pool.query(sqlDeleteUser, [id], (error, result) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: 'An error occurred while deleting a evaluation row' });
    } else {
      res.status(200).json({ message: 'Evaluation row deleted successfully' });
    }
  });
}

//upload report card
function reportPdf__(req, res) {
  if (!req.file) {
    return res.status(400).send({message:'No se encontró el archivo', code:'FILE_NOT_FOUND'});
  }
  const id = req.params.id;
  const file = req.file;
  console.log(req.file);
console.log(id);
  const sqlUploadReport =
    'UPDATE evaluation_data SET report_url = ? WHERE id = ?';

  pool.query(sqlUploadReport, [file.path, id], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Hubo un error al subir el archivo');
    }

    res.status(200).send('Archivo subido con éxito');
  });
}

module.exports = {
  userCreate__,
  deleteEvaluation__,
  deleteUser__,
  reportPdf__,
};
