// Import required modules
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {
  getAuthToken,
  getSpreadSheetValues,
  updateSpreadSheetValues,
} = require("./googleSheetsServices");

// Initialize app
const app = express();
const port = process.env.PORT || 8000;
const spreadsheetId = "1t97SfWgrn_JpG_N1Gf8JCn8Fs-XOcjuGq-30CccC_oo";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server is running successfully!" });
});

app.get("/api/v1/thermal", async (req, res) => {
  try {
    const auth = await getAuthToken();

    const sheet = await getSpreadSheetValues({
      spreadsheetId: spreadsheetId,
      auth: auth,
      sheetName: "thermal!A:ZZ",
    });
    const values = sheet.data.values;

    res.status(200).json(values);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

app.post("/api/v1/thermal", async (req, res) => {
  try {
    const auth = await getAuthToken();
    const update = await updateSpreadSheetValues({
      spreadsheetId: spreadsheetId,
      auth: auth,
      sheetName: "thermal!A:ZZ",
      values: req.body.values,
    });

    update
      ? res.status(200).json(update)
      : res.status(500).json({ message: "Error while updating" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: req.body.values, message: error });
  }
});

app.get("/api/v1/thermal", async (req, res) => {
  try {
    const auth = await getAuthToken();
    const sheet = await getSpreadSheetValues({
      spreadsheetId: spreadsheetId,
      auth: auth,
      sheetName: "thermal!A:ZZ",
    });
    const values = sheet.data.values;

    res.status(200).json(values);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

app.listen(port, () => {
  // Use the port variable
  console.log(`Server is running on port ${port}`);
});
