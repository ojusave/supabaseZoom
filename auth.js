require('dotenv').config();
const axios = require('axios');
const qs = require('querystring');

async function chatbotToken() {
  console.log('Getting Zoom client credentials token...');
  const tokenUrl = 'https://zoom.us/oauth/token';
  const credentials = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(tokenUrl, 
      qs.stringify({ grant_type: 'client_credentials' }),
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    console.log('Zoom client credentials token obtained');
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Zoom client credentials token:', error);
    throw error;
  }
}

async function oAuthToken() {
  console.log('Getting Zoom account credentials token...');
  const tokenUrl = 'https://zoom.us/oauth/token';
  const credentials = Buffer.from(`${process.env.ZOOM_CLIENT_ID1}:${process.env.ZOOM_CLIENT_SECRET1}`).toString('base64');

  try {
    const response = await axios.post(tokenUrl, 
      qs.stringify({ 
        grant_type: 'account_credentials',
        account_id: process.env.ZOOM_ACCOUNT_ID
      }),
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    console.log('Zoom account credentials token obtained');
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Zoom account credentials token:', error);
    throw error;
  }
}

module.exports = { chatbotToken, oAuthToken };
