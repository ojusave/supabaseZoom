const axios = require('axios');
const { oAuthToken } = require('./auth');

async function getRecordings() {
  const accessToken = await oAuthToken();
  const baseUrl = 'https://api.zoom.us/v2';
  const recordingsUrl = `${baseUrl}/users/me/recordings`;

  const today = new Date();
  const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));

  let allRecordings = [];
  let currentDate = new Date(sixMonthsAgo);

  while (currentDate < new Date()) {
    const fromDate = currentDate.toISOString().split('T')[0];
    currentDate.setDate(currentDate.getDate() + 30);
    const toDate = currentDate < new Date() ? currentDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    console.log(`Fetching recordings from ${fromDate} to ${toDate}`);
    try {
      let nextPageToken = '';
      do {
        const response = await axios.get(recordingsUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            from: fromDate,
            to: toDate,
            page_size: 300,
            next_page_token: nextPageToken
          }
        });

        console.log(`Fetched ${response.data.meetings.length} recordings for this period`);
        allRecordings = allRecordings.concat(response.data.meetings);
        nextPageToken = response.data.next_page_token;
      } while (nextPageToken);
    } catch (error) {
      console.error(`Error fetching recordings for ${fromDate} to ${toDate}:`, error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  }

  console.log(`Total recordings fetched: ${allRecordings.length}`);
  return allRecordings;
}

async function getMeetingSummaries() {
  const accessToken = await oAuthToken();
  const baseUrl = 'https://api.zoom.us/v2';
  const summariesUrl = `${baseUrl}/meetings/meeting_summaries`;

  const today = new Date();
  const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));

  let allSummaries = [];
  let currentDate = new Date(sixMonthsAgo);

  while (currentDate < new Date()) {
    const fromDate = currentDate.toISOString();
    currentDate.setMonth(currentDate.getMonth() + 1);
    const toDate = currentDate < new Date() ? currentDate.toISOString() : new Date().toISOString();

    console.log(`Fetching meeting summaries from ${fromDate} to ${toDate}`);
    try {
      let nextPageToken = '';
      do {
        const response = await axios.get(summariesUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            from: fromDate,
            to: toDate,
            page_size: 300,
            next_page_token: nextPageToken
          }
        });

        console.log(`Fetched ${response.data.summaries.length} summary entries for this period`);
        for (const summary of response.data.summaries) {
          console.log(`Fetching detailed summary for meeting ${summary.meeting_uuid}`);
          const detailedSummary = await getMeetingSummaryDetails(accessToken, summary.meeting_uuid);
          allSummaries.push(detailedSummary);
        }
        nextPageToken = response.data.next_page_token;
      } while (nextPageToken);
    } catch (error) {
      console.error(`Error fetching meeting summaries for ${fromDate} to ${toDate}:`, error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  }

  console.log(`Total meeting summaries fetched: ${allSummaries.length}`);
  return allSummaries;
}

async function getMeetingSummaryDetails(accessToken, meetingId) {
  const baseUrl = 'https://api.zoom.us/v2';
  const summaryUrl = `${baseUrl}/meetings/${meetingId}/meeting_summary`;

  try {
    const response = await axios.get(summaryUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching detailed meeting summary for meeting ID ${meetingId}:`, error);
    throw error;
  }
}

async function sendZoomChatMessage(message, toJid) {
  const chatbotToken = await chatbotToken();
  console.log('Sending chat message to Zoom with message:', message);

  try {
    const response = await axios.post('https://api.zoom.us/v2/im/chat/messages', {
      robot_jid: process.env.ZOOM_BOT_JID,
      to_jid: toJid,
      account_id: process.env.ZOOM_ACCOUNT_ID,
      content: {
        head: {
          text: 'Zoom Bot Response'
        },
        body: [{
          type: 'message',
          text: message
        }]
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + chatbotToken
      }
    });

    console.log('Request to Zoom Chat API:', {
      url: 'https://api.zoom.us/v2/im/chat/messages',
      method: 'POST',
      headers: response.config.headers,
      data: response.config.data,
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Failed to send chat message to Zoom Chat API. Status: ${response.status} ${response.statusText}`);
    }

    console.log('Response from Zoom Chat API:', response.data);
  } catch (error) {
    console.error('Error sending chat message to Zoom Chat API:', error);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    throw error;
  }
}
module.exports = { getRecordings, getMeetingSummaries, sendZoomChatMessage };

