import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Set up Google Gemini API
GOOGLE_API_KEY = "AIzaSyAHgffPdqk9PsE74s8SvEiylajl70elk6c"
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Initialize Gemini model
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=GOOGLE_API_KEY,
    temperature=0.7
)

# System prompt for EcoInvest assistant
SYSTEM_PROMPT = """You are EcoInvest AI Assistant, a helpful and knowledgeable AI focused on sustainable investing, ESG (Environmental, Social, Governance) factors, and green technology companies.

Your role is to:
- Help users understand sustainable investing concepts
- Provide information about ESG ratings and green innovation
- Discuss environmental impact and sustainability trends
- Answer questions about clean energy, carbon credits, and eco-friendly investments
- Offer insights on sustainable finance and responsible investing

Keep your responses informative, friendly, and focused on sustainability and responsible investing. Use markdown formatting to make your responses clear and well-structured."""

# Store conversation history per session
conversation_history = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        session_id = data.get('session_id', 'default')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Get or create conversation history for this session
        if session_id not in conversation_history:
            conversation_history[session_id] = [
                SystemMessage(content=SYSTEM_PROMPT)
            ]
        
        # Add user message to history
        conversation_history[session_id].append(HumanMessage(content=user_message))
        
        # Get response from Gemini
        response = llm.invoke(conversation_history[session_id])
        
        # Add AI response to history
        conversation_history[session_id].append(AIMessage(content=response.content))
        
        # Keep only last 20 messages (plus system message) to avoid context getting too long
        if len(conversation_history[session_id]) > 21:
            conversation_history[session_id] = [
                conversation_history[session_id][0]  # Keep system message
            ] + conversation_history[session_id][-20:]  # Keep last 20 messages
        
        return jsonify({
            'response': response.content,
            'status': 'success'
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
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
