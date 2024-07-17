require('dotenv').config();
const express = require('express');
const { getRecordings, getMeetingSummaries, sendZoomChatMessage } = require('./api');
const { oAuthToken, chatbotToken } = require('./auth');

const { sendData, getData } = require('./data');

const app = express();
app.use(express.json());

app.post('/chatbot', async (req, res) => {
  console.log('Received request body:', JSON.stringify(req.body));
  const { payload: { cmd, toJid } } = req.body;
  console.log('Command received:', cmd);
  console.log('To JID:', toJid);

  if (cmd == 'update') {
    console.log('Entering update condition');
    try {
      console.log('Starting update process');
      console.log('About to fetch recordings');
      const recordings = await getRecordings();
      console.log(`Fetched ${recordings.length} recordings`);

      console.log('About to fetch meeting summaries');
      const meetingSummaries = await getMeetingSummaries();
      console.log(`Fetched ${meetingSummaries.length} meeting summaries`);

      await sendData({ type: 'recordings', data: recordings });
      await sendData({ type: 'meetingSummaries', data: meetingSummaries });

      const storedData = await getData();
      console.log('Stored data:', storedData);

      await sendZoomChatMessage('Data has been updated successfully.', toJid);
      res.status(200).send('Update completed');
    } catch (error) {
      console.error('Error during update:', error);
      console.error('Error stack:', error.stack);
      await sendZoomChatMessage('An error occurred during the update process.', toJid);
      res.status(500).send('Error during update');
    }
  } else if (cmd == 'get') {
    try {
      const storedData = await getData();
      await sendZoomChatMessage(JSON.stringify(storedData), toJid);
      res.status(200).send('Get completed');
    } catch (error) {
      console.error('Error during get:', error);
      await sendZoomChatMessage('An error occurred while retrieving data.', toJid);
      res.status(500).send('Error during get');
    }
  } else {
    res.status(400).send('Invalid command');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
