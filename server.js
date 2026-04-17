const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwIAuU40eWiudcykr_oeFkG1zuk18_5WDJvxPme3dCnHDtLkrM4X1jg75DWjmtsEEb-/exec';

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post('/submit', async (req, res) => {
  try {
    const { name, businessName, email, phone, service, budget, goals } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email and phone are required.' });
    }

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const params = new URLSearchParams({ timestamp, name, businessName: businessName || '', email, phone, service: service || '', budget: budget || '', goals: goals || '' });
    await fetch(GOOGLE_SCRIPT_URL + '?' + params.toString(), { redirect: 'follow' });

    console.log(`✅ Lead saved to Google Sheets: ${name} (${email}) at ${timestamp}`);
    res.json({ success: true, message: 'Lead saved to Google Sheets.' });

  } catch (err) {
    console.error('❌ Error saving lead:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 S&C Lead Server running at http://localhost:${PORT}`);
  console.log(`📊 Google Sheets: ${GOOGLE_SCRIPT_URL}\n`);
});
