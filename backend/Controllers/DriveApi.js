const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']; //si dice no authorizado , cambiar nombre de token.json y se generara otro que pedira login en google
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

//LOCAL PARA GOOGLE APIS
//const TOKEN_PATH = path.join(process.cwd(), 'token.json');
//const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials_ulead.json');

//RUTA RENDER
const TOKEN_PATH = '/etc/secrets/token.json';
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
    console.error('Error in loadSavedCredentialsIfExist Drive Api',err)
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
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
 * Load or request or authorization to call APIs.
 *
 */
async function authorizeDrive() {
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

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
     const querySearch = req.query.querySearch ?? '';
*/
//let querySearch = 'chat';

async function listFiles(authClient, req) {
  const searchInput = req.query.searchInput ?? '';
  const drive = google.drive({ version: 'v3', auth: authClient });
  const res = await drive.files.list({
    pageSize: 150,
    fields: 'nextPageToken, files(id, name)',
    q: `name contains '${searchInput}'`,
  });
  const files = res.data.files;

  if (files.length === 0) {
    console.log('No files found.');
    return;
  }

  /*
  console.log('Files:');

  files.map((file) => {
    console.log(`${file.name} (${file.id})`);
  });
  */
  return files;
}

module.exports = {
  listFiles,
  authorizeDrive,
};
