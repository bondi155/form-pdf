//const db = require('../Config/dbConfig'); local para pruebas
require('dotenv').config();
const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretkey = process.env.JWT_SECRET;
const path = require('path');

//agregar if where nombre
//join del nombre  este hace el query por el nombre que le pasamos en la funcion principal .
function consultJoin__(req, res, name) {
  const company = req.query.domainName ?? '';
  let sqlQuery = `
SELECT 
  pd.id AS pd_id, 
  pd.full_name AS pd_full_name, 
  pd.personal_email, 
  pd.cellphone, 
  pd.age, 
  pd.country, 
  pd.course, 
  pd.flight_hours AS pd_flight_hours, 
  pd.flight_status, 
  pd.experience, 
  pd.type_airc, 
  pd.company AS pd_company, 
  pd.company_email AS pd_company_email, 
  pd.rtari_level AS pd_rtari_level, 
  pd.rtari_expires, 
  pd.english_status, 
  pd.hours_english AS pd_hours_english, 
  pd.level_english, 
  pd.other_career, 
  pd.contact, 
  pd.option_pay, 
  pd.date_form, 
  pd.start_date, 
  pd.end_date, 
  pd.asist, 
  pd.payment, 
  pd.calif, 
  pd.status, 
  pd.comments_pd,
  GROUP_CONCAT(ed.id) AS ed_ids, 
  GROUP_CONCAT(ed.base) AS ed_bases, 
  GROUP_CONCAT(ed.company_email) AS ed_company_emails, 
  GROUP_CONCAT(ed.flight_hours) AS ed_flight_hours, 
  GROUP_CONCAT(ed.rtari_level) AS ed_rtari_levels, 
  GROUP_CONCAT(ed.first_exam) AS ed_first_exams, 
  GROUP_CONCAT(ed.time) AS ed_times, 
  GROUP_CONCAT(ed.exam_calif) AS ed_exam_califs, 
  GROUP_CONCAT(ed.result) AS ed_results,
  GROUP_CONCAT(ed.applicant_name) AS ed_applicant_name,
  GROUP_CONCAT(ed.month) AS ed_month,
  GROUP_CONCAT(ed.applicant_area) AS ed_applicant_area,
  GROUP_CONCAT(ed.test_type) AS ed_test_type,
  GROUP_CONCAT(ed.no_ambassador) AS ed_no_ambassador,
  GROUP_CONCAT(ed.full_name) AS ed_full_name,
  GROUP_CONCAT(ed.position) AS ed_position
FROM personal_data pd
LEFT JOIN evaluation_data ed ON pd.full_name = ed.full_name
WHERE pd.full_name = ?`;

  let companyValue;

  if (company.toLowerCase() === 'tsm') {
    companyValue = company.toUpperCase();
  } else {
    companyValue =
      company.charAt(0).toUpperCase() + company.slice(1).toLowerCase();
  }

  let queryName = [name];
  if (company !== 'admin') {
    sqlQuery += ' AND pd.company = ?';
    queryName.push(companyValue);
  }

  sqlQuery += `
GROUP BY pd.id, pd.full_name, pd.personal_email, pd.cellphone, pd.age,
pd.country, pd.course, pd.flight_hours, pd.flight_status, pd.experience,
pd.type_airc, pd.company, pd.company_email,
pd.rtari_level, pd.rtari_expires, pd.english_status, pd.hours_english,
pd.level_english, pd.other_career, pd.contact, pd.option_pay, pd.date_form, pd.start_date,
pd.end_date, pd.asist, pd.payment, pd.calif, pd.status
`;

  try {
    pool.query(sqlQuery, queryName, (err, result) => {
      if (err) {
        console.error(
          'Error executing sqlGetPerDataByName query..Check DB connection',
          err
        );
        return res.status(500).send('Error to get personal data trought Name');
      }

      if (result.length === 0) {
        return res.send('No data found');
      }
      res.send(result);
      //  console.log(result);
    });
  } catch (error) {
    console.error('Error in consultJoin__ function ', error);
  }
}

function consultEmailComp__(req, res) {
  try {
    const company = req.query.domainName ?? '';
    const email = req.query.email ?? '';
    //transformo el volaris o tsm , en minuscula del usuario en Volaris o TSM

    let companyValue;

    if (company.toLowerCase() === 'tsm') {
      companyValue = company.toUpperCase();
    } else {
      companyValue =
        company.charAt(0).toUpperCase() + company.slice(1).toLowerCase();
    }

    let sqlGetPerDataByCompEmail =
      'SELECT * FROM personal_data WHERE company_email = ?';

    let queryParamsEmail = [email];
    if (company !== 'admin') {
      sqlGetPerDataByCompEmail += ' AND company = ?';
      queryParamsEmail.push(companyValue);
    }
    // console.log('query de email', sqlGetPerDataByCompEmail, queryParamsEmail);

    pool.query(sqlGetPerDataByCompEmail, queryParamsEmail, (err, result) => {
      if (err) {
        console.error(
          'Error in query sqlGetPerDataByEmail...Check DB connection',
          err
        );
        return res.status(500).send('Error to get personal data by email');
      }

      if (result.length === 0) {
        return res.send('No data found');
      }
      const name = result[0].full_name;
      consultJoin__(req, res, name); //en verdad se ejecuta esta funcion pero con el nombre que sacamos del email
    });
  } catch (err) {
    console.error('Error in ConsultEmail function', err);
  }
}

//agregar where company
//si se busca por email
function consultEmail__(req, res) {
  try {
    const company = req.query.domainName ?? '';
    const email = req.query.email ?? '';
    //transformo el volaris o tsm , en minuscula del usuario en Volaris o TSM

    let companyValue;

    if (company.toLowerCase() === 'tsm') {
      companyValue = company.toUpperCase();
    } else {
      companyValue =
        company.charAt(0).toUpperCase() + company.slice(1).toLowerCase();
    }

    let sqlGetPerDataByEmail =
      'SELECT * FROM personal_data WHERE personal_email = ?';

    let queryParamsEmail = [email];
    if (company !== 'admin') {
      sqlGetPerDataByEmail += ' AND company = ?';
      queryParamsEmail.push(companyValue);
    }
    // console.log('query de email', sqlGetPerDataByEmail, queryParamsEmail);

    pool.query(sqlGetPerDataByEmail, queryParamsEmail, (err, result) => {
      if (err) {
        console.error(
          'Error in query sqlGetPerDataByEmail...Check DB connection',
          err
        );
        return res.status(500).send('Error to get personal data by email');
      }

      if (result.length === 0) {
        return res.send('No data found');
      }
      const name = result[0].full_name;
      consultJoin__(req, res, name); //en verdad se ejecuta esta funcion pero con el nombre que sacamos del email
    });
  } catch (err) {
    console.error('Error in ConsultEmail function', err);
  }
}

//ejecucion con condicion de funciones
//aca vamos a agregar la funcion de company email
function consultaData__(req, res) {
  try {
    const email = req.query.email ?? '';
    //const company = req.query.domainName
    if (email.includes('@')) {
      consultEmail__(req, res);
    } else if (email.includes('volaris')) {
      consultEmailComp__(req, res);
    } else {
      consultJoin__(req, res, email);
    }
  } catch (error) {
    console.error('Error in general function execution consultData', error);
  }
}

// Aquí se crea el endpoint adicional para el autocompletado
function autocompleteName(req, res) {
  try {
    // se toma la entrada del usuario y se añade el comodín % al inicio y al final
    const email = `%${req.query.email ?? ''}%`;
    const company = req.query.domainName ?? '';

    let companyValue;

    if (company.toLowerCase() === 'tsm') {
      companyValue = company.toUpperCase();
    } else {
      companyValue =
        company.charAt(0).toUpperCase() + company.slice(1).toLowerCase();
    }
    let sqlLikeName = `
    SELECT DISTINCT pd.full_name AS pd_full_name, pd.personal_email AS pd_personal_email, pd.company_email AS pd_company_email
    FROM personal_data pd
    WHERE pd.full_name LIKE ?
  `;
    // Aquí se modifica la consulta SQL para que busque coincidencias parciales
    let queryName = [email];
    if (company !== 'admin') {
      sqlLikeName += ' AND pd.company = ?';
      queryName.push(companyValue);
    }
    //console.log(sqlLikeName, queryName, companyValue);

    pool.query(sqlLikeName, queryName, (err, result) => {
      if (err) {
        console.error('Error in suggestion query like%', err);
        return res
          .status(500)
          .send('Error to get personal data for autocomplete');
      }

      if (result.length === 0) {
        return res.send('No data found for suggestions');
      }

      const suggestions = result.map((item) => ({
        name: item.pd_full_name,
        email: item.pd_personal_email,
        email_company: item.pd_company_email,
      }));

      res.send(suggestions);
    });
  } catch (error) {
    console.error('Suggestion fuction execution error', error);
  }
}
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

//get para aerolineas segun usuario
function EvalCompany__(req, res) {
  const username = req.query.domainName ?? '';

  const sqlGetEvalCompany = `SELECT e.*, COALESCE(c.cuenta, 1) as 'evaluaciones'
  FROM evaluation_data e
  LEFT JOIN (
      SELECT LOWER(full_name) as lower_full_name, COUNT(*) as cuenta
      FROM evaluation_data
      WHERE LOWER(company) = LOWER(?)
      AND first_exam LIKE '%23' OR first_exam LIKE '%24' OR first_exam LIKE '%25' OR first_exam LIKE '%26'
      GROUP BY lower_full_name
  ) c ON LOWER(e.full_name) = c.lower_full_name
  WHERE LOWER(e.company) = LOWER(?)
  AND e.first_exam LIKE '%23' OR first_exam LIKE '%24' OR first_exam LIKE '%25' OR first_exam LIKE '%26'
  ORDER BY e.id DESC;
  `;

  pool.query(sqlGetEvalCompany, [username, username], (err, result) => {
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

//get para dashboard home graficos
function getExamData__(req, res) {
  const company = req.query.domainName ?? '';
  const sqlGetTotalCalif = `SELECT COUNT(*) AS total_calif FROM evaluation_data WHERE (first_exam LIKE '%23' OR first_exam LIKE '%24' OR first_exam LIKE '%25' OR first_exam LIKE '%26') AND LOWER(company) = LOWER(?)`;
  const sqlGetGroupCalif = `SELECT exam_calif, COUNT(*) AS count FROM evaluation_data WHERE LOWER(company) = LOWER(?) AND (first_exam LIKE '%23' OR first_exam LIKE '%24' OR first_exam LIKE '%25' OR first_exam LIKE '%26') GROUP BY exam_calif`;
  // Obtener el total de exam_calif
  pool.query(sqlGetTotalCalif, company, (err, totalCalifResult) => {
    if (err) {
      console.error('Error fetching total exam data:', err);
      return res
        .status(500)
        .send('Internal Server Error when fetching total exam data.');
    }

    const totalCalif = totalCalifResult[0].total_calif;

    // Obtener el desglose de calificaciones de usuarios company
    pool.query(sqlGetGroupCalif, company, (err, breakdownResult) => {
      if (err) {
        console.error('Error fetching breakdown exam data:', err);
        return res
          .status(500)
          .send('Internal Server Error when fetching breakdown exam data.');
      }

      // Construir un objeto para el desglose
      let breakdown = {};
      breakdownResult.forEach((row) => {
        breakdown[row.exam_calif] = row.count;
      });

      // Devolver la data
      res.json({
        total: totalCalif,
        breakdown: breakdown,
      });
    });
  });
}
// Compañias que ofrecen exámenes con valores
function getAllCompanies__(req, res) {
  const sqlGetAllCompanies =
    'SELECT company, COUNT(id) as total_ids FROM evaluation_data GROUP BY company';
  pool.query(sqlGetAllCompanies, (err, companies) => {
    if (err) {
      console.error('Error fetching all companies:', err);
      return res
        .status(500)
        .send('Internal Server Error when fetching companies.');
    }

    res.json(companies);

    //console.log(companies);
  });
}
// Ultimas evaluaciones depende la compañia
function listLastEvals__(req, res) {
  const username = req.query.domainName ?? '';

  const sqlGetLastEvals = `SELECT * 
    FROM evaluation_data 
    WHERE LOWER(company) = LOWER(?) 
    ORDER BY id DESC LIMIT 10
    `;
  pool.query(sqlGetLastEvals, username, (err, result) => {
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

function getDateEval__(req, res) {
  const company = req.query.domainName ?? '';

  const sqlGetDate = `SELECT first_exam, full_name from evaluation_data WHERE LOWER(company) = LOWER(?) ORDER BY id DESC LIMIT 1`;
  pool.query(sqlGetDate, company, (err, result) => {
    if (err) {
      console.error(
        'Error executing query sqlGetDate..Check DB connection',
        err
      );
      return res.status(500).send('Error to get Date of Exams');
    }
    res.send(result);
  });
}

module.exports = {
  consultaData__,
  consultaEvalData__,
  consultEmail__,
  consultEmailComp__,
  autocompleteName,
  getDateEval__,
  loginUsers__,
  listUsers__,
  download__,
  EvalCompany__,
  getExamData__,
  getAllCompanies__,
  listLastEvals__,
};
