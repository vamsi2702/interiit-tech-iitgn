import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage, SystemMessage

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Set up Google Gemini API
GOOGLE_API_KEY = "AIzaSyAHgffPdqk9PsE74s8SvEiylajl70elk6c"
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Initialize Gemini model
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=GOOGLE_API_KEY,
    temperature=0.7,
    convert_system_message_to_human=True
)

# System prompt for EcoInvest AI
SYSTEM_PROMPT = """You are EcoInvest AI, an expert assistant for sustainable investing and ESG analysis. 
You help users with:
- Company sustainability analysis and ESG ratings
- Carbon credit projects and environmental initiatives
- Investment recommendations based on environmental impact
- Latest sustainability news and trends
- Watchlist management and portfolio tracking

Be professional, concise, and focus on sustainability and environmental impact in your responses.
Provide actionable insights and data-driven recommendations."""

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Create messages for the chat
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=user_message)
        ]
        
        # Get response from Gemini
        response = llm.invoke(messages)
        
        return jsonify({
            'response': response.content,
            'status': 'success'
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'message': 'EcoInvest AI Bot is running'})

if __name__ == '__main__':
    print("Starting EcoInvest AI Bot server...")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000, host='0.0.0.0')
