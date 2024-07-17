# Zoom Recording Query Bot

This Node.js application integrates with Zoom to fetch recordings and meeting summaries, providing a chatbot interface for querying and updating data through Zoom Team Chat.

## Features

- Fetch Zoom recordings and meeting summaries
- Store and retrieve data using a custom endpoint
- Interact with users through Zoom Team Chat
- OAuth2 authentication with Zoom API

## Prerequisites

- Node.js
- Zoom One Pro, Standard Pro, Business, or Enterprise account
- Zoom Mail and Calendar Clients enabled with customized domains
- Zoom Team Chat enabled
- End-to-end encryption disabled on Zoom Mail
- Configured Zoom App and Chatbot with required scopes

## Setup

1. Clone the repository
2. Navigate to the project directory
3. Copy `sample.env` to `.env` and add the required values from Zoom Developer Portal
4. Install dependencies: `npm install`

## Environment Variables

Add the following to your `.env` file:




ZOOM_CLIENT_ID=your_client_id 
ZOOM_CLIENT_SECRET=your_client_secret 
ZOOM_ACCOUNT_ID=your_account_id 
ZOOM_BOT_JID=your_bot_jid 
PORT=4000


## Running the Application

Start the server:




node server.js


The server will run on `http://localhost:4000`

## Usage

1. Create and install the application from the Zoom Marketplace
2. Interact with the bot in Zoom Team Chat:
   - Send "update" to fetch and store new recordings and meeting summaries
   - Send "get" to retrieve stored data

## Code Structure

- `server.js`: Express server setup and request handling
- `auth.js`: OAuth2 authentication logic
- `api.js`: Zoom API interactions (fetching recordings, meeting summaries, sending chat messages)
- `data.js`: Data storage and retrieval using custom endpoint

## Dependencies

- axios: HTTP requests
- dotenv: Environment variable management
- express: Web server framework
- body-parser: Request body parsing

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
