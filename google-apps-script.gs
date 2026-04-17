// ─── S&C Digital Agency — Google Sheets Lead Collector ───────────────────────
//
// SETUP STEPS:
// 1. Open your Google Sheet
// 2. Click Extensions → Apps Script
// 3. Delete any existing code and paste ALL of this code
// 4. Click Save (floppy disk icon)
// 5. Click Deploy → New deployment  (or Manage deployments → New version if already deployed)
//    - Type: Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Click Deploy → Authorize when prompted → Copy the Web App URL
// ──────────────────────────────────────────────────────────────────────────────

var SHEET_NAME = 'Leads';

var HEADERS = [
  'Timestamp',
  'Name',
  'Business Name',
  'Email',
  'Phone / WhatsApp',
  'Service Interested In',
  'Monthly Budget',
  'Business Goals'
];

function saveRow(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([
    data.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    data.name || '',
    data.businessName || '',
    data.email || '',
    data.phone || '',
    data.service || '',
    data.budget || '',
    data.goals || ''
  ]);
}

// Handles GET requests from the website form (no-cors compatible)
function doGet(e) {
  try {
    var p = e.parameter;
    saveRow(p);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handles POST requests (kept for server-side proxy if needed)
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    saveRow(data);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Run this in the Apps Script editor to test without deploying
function testSave() {
  saveRow({
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    name: 'Test User',
    businessName: 'Test Co.',
    email: 'test@example.com',
    phone: '9999999999',
    service: 'SEO',
    budget: '₹20,000 – ₹50,000/mo',
    goals: 'Increase website traffic'
  });
  Logger.log('Row saved successfully');
}
