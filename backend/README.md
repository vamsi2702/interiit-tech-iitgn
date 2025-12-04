# EcoInvest AI Backend

Flask backend server with LangChain and Google Gemini integration for the EcoInvest chat assistant.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python aibot.py
```

The server will start on `http://localhost:5000`

## API Endpoints

- `POST /api/chat` - Send a message to the AI assistant
  - Request body: `{ "message": "your message here" }`
  - Response: `{ "response": "AI response", "status": "success" }`

- `GET /api/health` - Check server health
  - Response: `{ "status": "healthy", "message": "EcoInvest AI Bot is running" }`

## Environment Variables

- `GOOGLE_API_KEY` - Your Google Gemini API key (already configured in aibot.py)
