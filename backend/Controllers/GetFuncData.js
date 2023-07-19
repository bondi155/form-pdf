//const db = require('../Config/dbConfig'); local para pruebas
const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const bcrypt = require('bcrypt');

const sqlGetPerDataByName = `
SELECT pd.id AS pd_id, pd.full_name AS pd_full_name, pd.personal_email, pd.cellphone, pd.age, 
pd.country, pd.course, pd.flight_hours AS pd_flight_hours, pd.flight_status, pd.experience, 
pd.type_airc, pd.company AS pd_company, pd.company_email AS pd_company_email, 
pd.rtari_level AS pd_rtari_level, pd.rtari_expires, pd.english_status, pd.hours_english AS pd_hours_english, 
pd.level_english, pd.other_career, pd.contact, pd.option_pay, pd.date_form, pd.start_date, 
pd.end_date, pd.asist, pd.payment, pd.calif, pd.status, ed.* 
FROM personal_data pd
LEFT JOIN evaluation_data ed ON pd.full_name = ed.full_name
WHERE pd.full_name = ?
`;
//join del nombre
function consultJoin__(req, res, name) {
  try {
    pool.query(sqlGetPerDataByName, name, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error to get personal data trought mail');
      }

      if (result.length === 0) {
        return res.send('No data found');
      }
      res.send(result);
      console.log(result);
    });
  } catch (error) {
    console.log(error);
  }
}
//si se busca por email
function consultEmail__(req, res) {
  try {
    const email = req.query.email ?? '';
    const sqlGetPerDataByEmail =
      'SELECT * FROM personal_data WHERE personal_email = ?';
    pool.query(sqlGetPerDataByEmail, email, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error to get personal data');
      }

      if (result.length === 0) {
        return res.send('No data found');
      }

      const name = result[0].full_name;

      console.log(name);

      consultJoin__(req, res, name);
    });
  } catch (err) {
    console.log(err);
  }
}
//ejecucion con condicion de funciones
function consultaData__(req, res) {
  try {
    const email = req.query.email ?? '';

    if (email.includes('@')) {
      consultEmail__(req, res);
    } else {
      pool.query(sqlGetPerDataByName, email, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Error to get personal data');
        }

        if (result.length === 0) {
          return res.send('No data found');
        }

        res.send(result);
        console.log(result);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// Aquí se modifica la consulta SQL para que busque coincidencias parciales
const sqlGetPerDataByNameLike = `
  SELECT DISTINCT pd.full_name AS pd_full_name, pd.personal_email AS pd_personal_email
  FROM personal_data pd
  WHERE pd.full_name LIKE ?
`;
// Aquí se crea el endpoint adicional para el autocompletado
function autocompleteName(req, res) {
  try {
    // se toma la entrada del usuario y se añade el comodín % al inicio y al final
    const email = `%${req.query.email ?? ''}%`;

    pool.query(sqlGetPerDataByNameLike, email, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send('Error to get personal data for autocomplete');
      }

      if (result.length === 0) {
        return res.send('No data found');
      }

      const suggestions = result.map((item) => ({
        name: item.pd_full_name,
        email: item.pd_personal_email,
      }));

      res.send(suggestions);
    });
  } catch (error) {
    console.log(error);
  }
}
//evaluation data select
function consultaEvalData__(req, res) {
  const sqlGetEvalData = 'SELECT * FROM evaluation_data';

  pool.query(sqlGetEvalData, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error to get Evaluation data');
    }
    res.send(result);
  });
}

//get list users.
function listUsers__(req, res) {
  const sqlGetusuarios = 'SELECT * FROM users ';
  pool.query(sqlGetusuarios, (error, result) => {
    error ? console.log(error) : res.send(result);
  });
}

//func para validar usuarios
function loginUsers__(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const selectLogin = 'SELECT * FROM users WHERE username = ?';

  pool.query(selectLogin, [username], (err, result) => {
    if (err) {
      console.log('Error al realizar la conexion');
      res.status(500).send('Error al realizar la conexion');
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (err, response) => {
        if (err) {
          console.log(err);
        } else if (response) {
          res.send(result);
        } else {
          res.send({ code: 'USR_INCOR' });
        }
      });
    } else {
      res.send({ code: 'USR_NOT_EXIST' });
    }
  });
}

module.exports = {
  consultaData__,
  consultaEvalData__,
  consultEmail__,
  autocompleteName,
  loginUsers__,
  listUsers__,
};
