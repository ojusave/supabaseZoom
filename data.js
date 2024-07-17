const axios = require('axios');


async function sendData(data) {
  try {
    const response = await axios.post('https://ojus.ngrok.dev/store-data', data);
    console.log('Data sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending data to ngrok:', error);
    throw error;
  }
}


async function getData() {
  try {
    const response = await axios.get('https://ojus.ngrok.dev/get-data');
    return response.data;
  } catch (error) {
    console.error('Error getting data from ngrok:', error);
    throw error;
  }
}


module.exports = { sendData, getData };
