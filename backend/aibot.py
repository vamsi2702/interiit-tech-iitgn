import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain.tools import Tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from ui_functions import EcoInvestUIFunctions

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Set up Google Gemini API
GOOGLE_API_KEY = "AIzaSyAHgffPdqk9PsE74s8SvEiylajl70elk6c"
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Initialize UI Functions (shared for data access)
ui_functions_base = EcoInvestUIFunctions(data_dir="../src/data")

# Session-specific UI functions instances
session_ui_functions = {}

def get_session_ui_functions(session_id: str) -> EcoInvestUIFunctions:
    """Get or create UI functions instance for a session"""
    if session_id not in session_ui_functions:
        session_ui_functions[session_id] = EcoInvestUIFunctions(data_dir="../src/data")
    return session_ui_functions[session_id]

# Current session ID (will be set per request)
current_session_id = "default"

# Initialize Gemini model with tool calling
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=GOOGLE_API_KEY,
    temperature=0.7
)

# ==================== TOOL DEFINITIONS ====================

def get_company_info_tool(company_id: str) -> str:
    """Get detailed information about a company by ticker symbol (e.g., TSLA, MSFT, AAPL)."""
    ui_functions = get_session_ui_functions(current_session_id)
    company = ui_functions.get_company_by_id(company_id)
    if company:
        return json.dumps({
            "name": company["name"],
            "industry": company["industry"],
            "gii_score": company["gii_score"],
            "esg_rating": company["esg_rating"],
            "stock_price": company["stock_price"],
            "market_cap": company["market_cap"],
            "sustainability_update": company["sustainability_update"],
            "description": company.get("description", "N/A")
        }, indent=2)
    return f"Company {company_id} not found in the database."

def search_companies_tool(query: str) -> str:
    """Search for companies by name, ticker symbol, or industry. Returns matching companies."""
    ui_functions = get_session_ui_functions(current_session_id)
    results = ui_functions.search_companies(query)
    if results:
        companies_list = [
            f"- {c['name']} ({c['id']}): {c['industry']}, GII Score: {c['gii_score']}"
            for c in results[:5]  # Limit to top 5
        ]
        return f"Found {len(results)} companies:\n" + "\n".join(companies_list)
    return f"No companies found matching '{query}'."

def get_top_performers_tool(limit: str = "5") -> str:
    """Get the top performing companies by GII (Green Innovation Index) score."""
    ui_functions = get_session_ui_functions(current_session_id)
    try:
        limit_int = int(limit)
    except:
        limit_int = 5
    
    top_companies = ui_functions.get_top_performers(limit_int)
    companies_list = [
        f"{i+1}. {c['name']} ({c['id']}): GII {c['gii_score']}, ESG {c['esg_rating']}"
        for i, c in enumerate(top_companies)
    ]
    return "Top performing companies:\n" + "\n".join(companies_list)

def add_to_watchlist_tool(company_id: str) -> str:
    """Add a company to the user's watchlist by ticker symbol."""
    ui_functions = get_session_ui_functions(current_session_id)
    result = ui_functions.add_company_to_watchlist(company_id)
    return result['message']

def get_watchlist_tool(input: str = "") -> str:
    """Get all companies in the user's watchlist."""
    ui_functions = get_session_ui_functions(current_session_id)
    watchlist = ui_functions.get_watchlist_companies()
    if watchlist:
        companies_list = [
            f"- {c['name']} ({c['id']}): GII {c['gii_score']}, Stock ${c['stock_price']}"
            for c in watchlist
        ]
        return f"Your watchlist ({len(watchlist)} companies):\n" + "\n".join(companies_list)
    return "Your watchlist is empty. Add companies using their ticker symbols (e.g., TSLA, MSFT)."

def remove_from_watchlist_tool(company_id: str) -> str:
    """Remove a company from the user's watchlist by ticker symbol."""
    ui_functions = get_session_ui_functions(current_session_id)
    result = ui_functions.remove_company_from_watchlist(company_id)
    return result['message']

def get_latest_news_tool(limit: str = "5") -> str:
    """Get the latest sustainability and ESG news articles."""
    ui_functions = get_session_ui_functions(current_session_id)
    try:
        limit_int = int(limit)
    except:
        limit_int = 5
    
    news = ui_functions.get_latest_news(limit_int)
    news_list = [
        f"- [{n['sentiment']}] {n['title']}\n  {n['summary'][:100]}..."
        for n in news
    ]
    return "Latest news:\n" + "\n".join(news_list)

def search_news_tool(query: str) -> str:
    """Search news articles about sustainability, ESG, or specific topics."""
    ui_functions = get_session_ui_functions(current_session_id)
    results = ui_functions.search_news(query)
    if results:
        news_list = [
            f"- {n['title']} ({n['date'][:10]})\n  {n['summary'][:80]}..."
            for n in results[:5]
        ]
        return f"Found {len(results)} news articles:\n" + "\n".join(news_list)
    return f"No news articles found matching '{query}'."

def get_all_projects_tool(input: str = "") -> str:
    """Get information about available carbon credit and sustainability projects."""
    ui_functions = get_session_ui_functions(current_session_id)
    projects = ui_functions.get_all_projects()
    if projects:
        projects_list = [
            f"- {p.get('name', p.get('id', 'Unknown'))}: {p.get('type', 'N/A')} in {p.get('location', 'N/A')}"
            for p in projects[:8]
        ]
        return f"Available projects ({len(projects)} total):\n" + "\n".join(projects_list)
    return "No projects available at the moment."

def get_industry_stats_tool(input: str = "") -> str:
    """Get statistics about different industries in the platform."""
    ui_functions = get_session_ui_functions(current_session_id)
    stats = ui_functions.get_industry_statistics()
    industries_list = [
        f"- {industry}: {data['count']} companies, Avg GII: {data['avg_gii_score']}"
        for industry, data in list(stats['industries'].items())[:8]
    ]
    return f"Industry statistics ({stats['total_industries']} industries):\n" + "\n".join(industries_list)

def filter_by_esg_tool(min_rating: str = "A") -> str:
    """Filter companies by minimum ESG rating (AAA, AA, A, BBB, BB, B, etc.)."""
    ui_functions = get_session_ui_functions(current_session_id)
    results = ui_functions.filter_companies_by_esg(min_rating)
    if results:
        companies_list = [
            f"- {c['name']} ({c['id']}): ESG {c['esg_rating']}, GII {c['gii_score']}"
            for c in results[:8]
        ]
        return f"Companies with ESG rating {min_rating} or better ({len(results)} total):\n" + "\n".join(companies_list)
    return f"No companies found with ESG rating {min_rating} or better."

def get_system_stats_tool(input: str = "") -> str:
    """Get overall platform statistics including total companies, news, projects, and averages."""
    ui_functions = get_session_ui_functions(current_session_id)
    stats = ui_functions.get_system_stats()['stats']
    return json.dumps(stats, indent=2)

# Create tools list
tools = [
    Tool(name="get_company_info", func=get_company_info_tool, 
         description="Get detailed information about a company by ticker symbol (e.g., TSLA, MSFT, AAPL). Use this when user asks about a specific company."),
    
    Tool(name="search_companies", func=search_companies_tool,
         description="Search for companies by name, ticker, or industry. Use this when user wants to find companies or asks about companies in general."),
    
    Tool(name="get_top_performers", func=get_top_performers_tool,
         description="Get top performing companies by GII score. Use when user asks for best companies, top performers, or recommendations."),
    
    Tool(name="add_to_watchlist", func=add_to_watchlist_tool,
         description="Add a company to user's watchlist. Use when user wants to track or add a company to their watchlist."),
    
    Tool(name="get_watchlist", func=get_watchlist_tool,
         description="Get all companies in user's watchlist. Use when user asks about their watchlist or tracked companies."),
    
    Tool(name="remove_from_watchlist", func=remove_from_watchlist_tool,
         description="Remove a company from user's watchlist. Use when user wants to stop tracking a company."),
    
    Tool(name="get_latest_news", func=get_latest_news_tool,
         description="Get latest sustainability and ESG news. Use when user asks for news, updates, or latest information."),
    
    Tool(name="search_news", func=search_news_tool,
         description="Search news articles by topic or keyword. Use when user wants news about specific topics."),
    
    Tool(name="get_all_projects", func=get_all_projects_tool,
         description="Get available carbon credit and sustainability projects. Use when user asks about projects or carbon credits."),
    
    Tool(name="get_industry_stats", func=get_industry_stats_tool,
         description="Get industry statistics and breakdowns. Use when user asks about industries or sector analysis."),
    
    Tool(name="filter_by_esg", func=filter_by_esg_tool,
         description="Filter companies by ESG rating. Use when user wants highly rated ESG companies."),
    
    Tool(name="get_system_stats", func=get_system_stats_tool,
         description="Get overall platform statistics. Use when user asks about platform data or general statistics.")
]

# System prompt for the agent
AGENT_PROMPT = """You are EcoInvest AI, an intelligent agent specializing in sustainable investing and ESG analysis.

Your capabilities:
- Access real-time company data, ESG ratings, and GII (Green Innovation Index) scores
- Search and filter companies by various criteria
- Manage user watchlists
- Provide latest sustainability news and trends
- Analyze carbon credit projects
- Offer data-driven investment recommendations

Guidelines:
1. **Be Proactive**: When users ask about companies, use tools to fetch actual data
2. **Be Specific**: Provide exact numbers, ratings, and facts from the tools
3. **Be Helpful**: Suggest related actions (e.g., "Would you like me to add this to your watchlist?")
4. **Format Well**: Use markdown formatting with **bold** for emphasis, bullet points for lists
5. **Stay Focused**: Keep responses concise but informative, focused on sustainability

When users ask about:
- Specific companies → Use get_company_info or search_companies
- Best investments → Use get_top_performers and filter_by_esg
- Watchlist → Use get_watchlist, add_to_watchlist, or remove_from_watchlist
- News → Use get_latest_news or search_news
- Projects → Use get_all_projects
- General info → Use get_system_stats or get_industry_stats

Always provide actionable insights based on real data from the tools."""

# Create the prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", AGENT_PROMPT),
    MessagesPlaceholder(variable_name="chat_history", optional=True),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad")
])

# Create the agent
agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    handle_parsing_errors=True,
    max_iterations=5
)

# Store conversation history (in production, use a database)
conversation_history = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    global current_session_id
    try:
        data = request.json
        user_message = data.get('message', '')
        session_id = data.get('session_id', 'default')
        
        # Set the current session ID for tools to use
        current_session_id = session_id
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Get or create conversation history for this session
        if session_id not in conversation_history:
            conversation_history[session_id] = []
        
        # Get chat history for context
        chat_history = conversation_history[session_id]
        
        # Invoke the agent
        response = agent_executor.invoke({
            "input": user_message,
            "chat_history": chat_history
        })
        
        # Update conversation history
        conversation_history[session_id].append(HumanMessage(content=user_message))
        conversation_history[session_id].append(AIMessage(content=response['output']))
        
        # Keep only last 10 messages to avoid context getting too long
        if len(conversation_history[session_id]) > 20:
            conversation_history[session_id] = conversation_history[session_id][-20:]
        
        return jsonify({
            'response': response['output'],
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
