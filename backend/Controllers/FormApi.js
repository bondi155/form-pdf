const fs = require('fs').promises;
require('dotenv').config();
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const mysql = require('mysql2');
const { tab } = require('@testing-library/user-event/dist/tab');
const pool = mysql.createPool(process.env.DATABASE_URL);

const COLUMN_NAMES = [
  'full_name',
  'personal_email',
  'cellphone',
  'age',
  'country',
  'course',
  'flight_hours',
  'flight_status',
  'experience',
  'type_airc',
  'company',
  'company_email',
  'rtari_level',
  'rtari_expires',
  'english_status',
  'hours_english',
  'level_english',
  'other_career',
  'contact',
  'option_pay',
  'date_form',
  'start_date',
  'end_date',
  'asist',
  'payment',
  'calif',
  'status', // Nueva columna "status"
];

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials_ulead.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request authorization to call APIs.
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}
//hacer un select de la tabla tab_sheets where id = ufs , mandar el valor desde front con un req.query y ese valor guardarlo en tabName digamos que no se podra apretar el boton
//hasta mandar el valor este ...creo yo , sino buscare otra forma la pensare

//let tabName = 'UFS-28';

/**
 * Prints the names and majors of students in a sample spreadsheet.
 *
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listMajors(auth, req) {
  const tabName = req.query.tabName ?? '';
    console.log(tabName);

  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1vdaO42mWRbISh3QTcutqaTncMoTRmNxYpcyW1n6MDRI',
    range: `${tabName}!A2:AA`,
  });

  const rows = res.data.values;

  if (!rows || rows.length === 0) {
    console.log(
      'No data found in UleadAir sheet. Check if the name of the tab is correct.'
    );
    return;
  }

  const getSheetData = `INSERT INTO personal_data (${COLUMN_NAMES.join(
    ', '
  )}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  rows.forEach((row) => {
    // Obtener los datos de la fila
    const personalEmail = row[COLUMN_NAMES.indexOf('personal_email')];
    const course = row[COLUMN_NAMES.indexOf('course')];
    const status = row[COLUMN_NAMES.indexOf('status')];

    // Verificar si ya existe un registro con el mismo correo electrónico y curso
    const checkDuplicateQuery = `SELECT COUNT(*) as count FROM personal_data WHERE personal_email = ? AND course = ?`;
    pool.query(checkDuplicateQuery, [personalEmail, course], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const count = result[0].count;
        if (count === 0) {
          // No existe un registro duplicado, realizar la inserción
          const values = row.map((value) =>
            value !== '' && value !== undefined ? value : null
          );
          pool.query(getSheetData, values, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send(result);
              console.log(result);
            }
          });
        } else {
          console.log(
            `Registro duplicado encontrado: personal_email = ${personalEmail}, course = ${course}`
          );
        }
      }
    });

    if (status === 'finalizado') {
      const checkDatabaseStatusQuery = `SELECT status FROM personal_data WHERE personal_email = ? AND course = ?`;
      pool.query(
        checkDatabaseStatusQuery,
        [personalEmail, course],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            if (result && result.length > 0) {
              const databaseStatus = result[0].status;
              if (databaseStatus !== 'finalizado') {
                const updateStatusQuery = `UPDATE personal_data SET status = 'finalizado' WHERE personal_email = ? AND course = ?`;
                pool.query(
                  updateStatusQuery,
                  [personalEmail, course],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(
                        `Estado actualizado a "finalizado" para el correo electrónico ${personalEmail}`
                      );
                    }
                  }
                );
              }
            }
          }
        }
      );
    }

    const xColumnIndex = COLUMN_NAMES.indexOf('asist');
    const yColumnIndex = COLUMN_NAMES.indexOf('payment');
    const zColumnIndex = COLUMN_NAMES.indexOf('calif');
    const statusColumnIndex = COLUMN_NAMES.indexOf('status');

    const xValue = row[xColumnIndex];
    const yValue = row[yColumnIndex];
    const zValue = row[zColumnIndex];

    // Verificar si alguno de los campos X, Y o Z ha sido modificado
    if (
      xValue !== 'Pending' ||
      yValue !== 'Pending' ||
      zValue !== 'Pending' ||
      status === 'Updated'
    ) {
      let updateDataQuery = `UPDATE personal_data SET ${COLUMN_NAMES[xColumnIndex]} = ?, ${COLUMN_NAMES[yColumnIndex]} = ?, ${COLUMN_NAMES[zColumnIndex]} = ?`;

      // Verificar el estado antes de realizar la actualización
      if (status === 'Closed') {
        updateDataQuery += `, ${COLUMN_NAMES[statusColumnIndex]} = 'Closed'`;
      } else {
        updateDataQuery += `, ${COLUMN_NAMES[statusColumnIndex]} = 'Updated'`;
      }

      updateDataQuery += ` WHERE personal_email = ?`;
      const valuesToUpdate = [
        xValue !== 'Pending' ? xValue : null,
        yValue !== 'Pending' ? yValue : null,
        zValue !== 'Pending' ? zValue : null,
        personalEmail,
      ];

      pool.query(updateDataQuery, valuesToUpdate, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(
            `Datos de pago o asistencia actualizados para el correo electrónico ${personalEmail}`
          );
        }
      });
    }
  });
}

module.exports = {
  authorize,
  listMajors,
};
