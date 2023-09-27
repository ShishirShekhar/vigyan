const { google } = require("googleapis");

const sheets = google.sheets("v4");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

async function getAuthToken() {
  const credential = JSON.parse(
    Buffer.from(process.env.GOOGLE_KEY, "base64").toString().replace(/\n/g, "")
  );
  const auth = new google.auth.GoogleAuth({
    projectId: credential.project_id,
    credentials: {
      client_email: credential.client_email,
      private_key: credential.private_key,
    },
    scopes: SCOPES,
  });
  const authToken = await auth.getClient();
  return authToken;
}

async function getSpreadSheet({ spreadsheetId, auth }) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

async function getSpreadSheetValues({ spreadsheetId, auth, sheetName }) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName,
  });

  return res;
}

async function updateSpreadSheetValues({
  spreadsheetId,
  auth,
  sheetName,
  collector,
}) {
  const res = await sheets.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: sheetName,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [collector],
    },
  });

  return res;
}

module.exports = {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues,
  updateSpreadSheetValues,
};
