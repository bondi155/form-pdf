const fs = require('fs').promises;
require('dotenv').config();
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const mysql = require('mysql2');
const pool = mysql.createPool(process.env.DATABASE_URL);

const COLUMN_NAMES = [
  'date_form',
  'start_date',
  'end_date',
  'course',
  'full_name',
  'personal_email',
  'cellphone',
  'age',
  'country',
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
//const TOKEN_PATH = process.env.GOOGLE_TOKENS;
//const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS;

//const TOKEN_PATH = path.join(process.cwd(), 'token_sheet.json');
//const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials_ulead.json');

const TOKEN_PATH = '/etc/secrets/token_sheet.json';
const CREDENTIALS_PATH = '/etc/secrets/credentials_ulead.json';
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
    console.log(err);
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

//let tabName = 'UFS-28';

/**
 * Prints the names and majors of students in a sample spreadsheet.
 *
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */

//duplicate e insert
async function checkDuplicatesAndInsert(rows, res) {
  try {
    let insertedEmails = [];
    let ducplicated;
    let duplicatedState = false;      

    for (const row of rows) {
      const personalEmail = row[COLUMN_NAMES.indexOf('personal_email')];
      const course = row[COLUMN_NAMES.indexOf('course')];

      const checkDuplicateQuery = `SELECT COUNT(*) as count FROM personal_data WHERE personal_email = ? AND course = ?`;
      const [duplicateResult] = await pool
        .promise()
        .query(checkDuplicateQuery, [personalEmail, course]);

      const count = duplicateResult[0].count;
      if (count === 0) {
        const values = row.map((value, index) => {
          if (['asist', 'payment', 'calif'].includes(COLUMN_NAMES[index])) {
            return '0';
          }
          if (
            COLUMN_NAMES[index] === 'status' &&
            (value === '' || value === undefined)
          ) {
            return 'New';
          }
          return value !== '' && value !== undefined ? value : null;
        });

        const getSheetData = `INSERT INTO personal_data (${COLUMN_NAMES.join(
          ', '
        )}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        await pool.promise().query(getSheetData, values);
        insertedEmails.push(personalEmail);
        console.log('registros insertados', personalEmail);
      } else {
        console.log(
          `Registro duplicado encontrado: personal_email = ${personalEmail}, course = ${course}`
        );
        
         ducplicated =`Registro duplicado encontrado: personal_email = ${personalEmail}, course = ${course}`;
         duplicatedState = true;
         //console.log(duplicatedState);
      }
    }
    //    console.log(insertedEmails);

    return {insertedEmails, ducplicated, duplicatedState};
  } catch (error) {
    console.log('Error en checkDuplicatesAndInsert:', error);
  }
}

//UPDATE
async function updateStatusIfClosed(rows) {
  try {
    for (const row of rows) {
      const personalEmail = row[COLUMN_NAMES.indexOf('personal_email')];
      const course = row[COLUMN_NAMES.indexOf('course')];
      const status = row[COLUMN_NAMES.indexOf('status')];

      if (status === 'Closed') {
        const checkDatabaseStatusQuery = `SELECT status FROM personal_data WHERE personal_email = ? AND course = ?`;
        const [result] = await pool
          .promise()
          .query(checkDatabaseStatusQuery, [personalEmail, course]);

        if (result && result.length > 0) {
          const databaseStatus = result[0].status;
          if (databaseStatus !== 'Closed') {
            const updateStatusQuery = `UPDATE personal_data SET status = 'Closed' WHERE personal_email = ? AND course = ?`;
            await pool
              .promise()
              .query(updateStatusQuery, [personalEmail, course]);

            console.log(
              `Estado actualizado a "Closed" para el correo electrónico ${personalEmail}`
            );
          }
        }
      }
    }
  } catch (error) {
    console.log('Error en updateStatusIfClosed:', error);
  }
}

async function updatePaymentAndAttendance(rows, req, res) {
  try {
    for (const row of rows) {
      const personalEmail = row[COLUMN_NAMES.indexOf('personal_email')];
      const xColumnIndex = COLUMN_NAMES.indexOf('asist');
      const yColumnIndex = COLUMN_NAMES.indexOf('payment');
      const zColumnIndex = COLUMN_NAMES.indexOf('calif');
      const statusColumnIndex = COLUMN_NAMES.indexOf('status');

      const xValue = row[xColumnIndex];
      const yValue = row[yColumnIndex];
      const zValue = row[zColumnIndex];
      const status = row[statusColumnIndex];

      if (
        xValue !== '0' ||
        yValue !== '0' ||
        zValue !== '0' ||
        status === 'Updated'
      ) {
        let updateDataQuery = `UPDATE personal_data SET ${COLUMN_NAMES[xColumnIndex]} = ?, ${COLUMN_NAMES[yColumnIndex]} = ?, ${COLUMN_NAMES[zColumnIndex]} = ?`;

        if (status === 'Closed') {
          updateDataQuery += `, ${COLUMN_NAMES[statusColumnIndex]} = 'Closed'`;
        } else {
          updateDataQuery += `, ${COLUMN_NAMES[statusColumnIndex]} = 'Updated'`;
        }

        updateDataQuery += ` WHERE personal_email = ?`;
        const valuesToUpdate = [
          xValue !== '0' && xValue !== '' ? xValue : '0',
          yValue !== '0' && yValue !== '' ? yValue : '0',
          zValue !== '0' && zValue !== '' ? zValue : '0',
          personalEmail,
        ];

        await pool.promise().query(updateDataQuery, valuesToUpdate);

        console.log(
          `Datos de pago o asistencia actualizados para el correo electrónico ${personalEmail}`
        );
      }
    }
  } catch (error) {
    console.log('Error en updatePaymentAndAttendance:', error);
  }
}

async function listMajors(auth, req) {
  try {
    const tabName = req.query.tabName ?? '';
    //console.log(tabName);
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
    }

    const {insertedEmails, duplicated, duplicatedState} = await checkDuplicatesAndInsert(rows);

    await updateStatusIfClosed(rows);
    await updatePaymentAndAttendance(rows);

    return {insertedEmails, duplicated, duplicatedState};
  } catch (error) {
    console.log('Error en listMajors:', error);
  }
}

module.exports = {
  authorize,
  listMajors,
  checkDuplicatesAndInsert,
  updateStatusIfClosed,
  updatePaymentAndAttendance,
};
