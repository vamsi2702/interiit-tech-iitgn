"""
Flask Backend Application - Pathway Streaming

Main Flask application with REST API and WebSocket support.
Uses Pathway JSONL outputs for real-time data streaming.
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from datetime import datetime
import threading
import time
import logging

from backend_analysis import get_backend_analysis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# CORS configuration
cors_origins = os.getenv('CORS_ORIGINS', '*').split(',') if ',' in os.getenv('CORS_ORIGINS', '*') else '*'
CORS(app, resources={r"/*": {"origins": cors_origins}})

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Initialize analysis service
logger.info("🚀 Initializing Backend Analysis Service...")
analysis_service = get_backend_analysis()
logger.info("✅ Backend Analysis Service ready!")

# ============================================================================
# WEBSOCKET EVENTS
# ============================================================================

@socketio.on('connect')
def handle_connect():
    """Handle WebSocket connection"""
    logger.info(f'📡 Client connected: {request.sid}')
    emit('connection_response', {
        'status': 'connected',
        'message': 'Connected to Carbon Intelligence Backend'
    })

@socketio.on('disconnect')
def handle_disconnect():
    """Handle WebSocket disconnection"""
    logger.info(f'📡 Client disconnected: {request.sid}')

@socketio.on('request_data')
def handle_data_request(data):
    """Handle data requests from frontend"""
    data_type = data.get('type', 'analytics')
    try:
        if data_type == 'projects':
            result = analysis_service.get_all_projects(limit=100)
            emit('projects_update', result)
        elif data_type == 'finance':
            result = analysis_service.get_all_finance()
            emit('finance_update', result)
        elif data_type == 'news':
            result = analysis_service.get_all_news(limit=50)
            emit('news_update', result)
        elif data_type == 'analytics':
            result = analysis_service.get_analytics()
            emit('analytics_update', result)
    except Exception as e:
        logger.error(f"Error handling data request: {e}")
        emit('error', {'error': str(e)})

# Background data pusher - broadcasts on data changes
def background_data_pusher():
    """Monitor for data changes and broadcast immediately"""
    last_broadcast = None
    min_broadcast_interval = 1  # Minimum 1 second between broadcasts to avoid thrashing
    
    while True:
        try:
            time.sleep(0.5)  # Check frequently for changes
            
            # Check if data has changed
            if analysis_service.pathway_reader.has_changes():
                now = time.time()
                # Enforce minimum interval between broadcasts
                if last_broadcast is None or (now - last_broadcast) >= min_broadcast_interval:
                    analytics = analysis_service.get_analytics()
                    # Broadcast to all clients
                    socketio.emit('data_update', {
                        'analytics': analytics.get('analytics', {}),
                        'timestamp': datetime.now().isoformat()
                    })
                    logger.info("🔴 LIVE UPDATE: Broadcasting data changes to all clients")
                    last_broadcast = now
        except Exception as e:
            logger.error(f"Error in background pusher: {e}")
            time.sleep(1)

pusher_thread = threading.Thread(target=background_data_pusher, daemon=True)
pusher_thread.start()

# ============================================================================
# REST API ENDPOINTS
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify(analysis_service.get_health_status())

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get analytics dashboard"""
    return jsonify(analysis_service.get_analytics())

@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Get all projects"""
    limit = request.args.get('limit', 500, type=int)
    country = request.args.get('country', None)
    category = request.args.get('category', None)
    result = analysis_service.get_all_projects(limit=limit, country=country, category=category)
    return jsonify(result)

@app.route('/api/project/<project_id>', methods=['GET'])
def get_project(project_id):
    """Get specific project"""
    result = analysis_service.get_project_by_id(project_id)
    return jsonify(result)

@app.route('/api/projects/search', methods=['POST'])
def search_projects():
    """Search projects"""
    data = request.json
    query = data.get('query', '')
    limit = data.get('limit', 100)
    if not query:
        return jsonify({'success': False, 'error': 'Query required'}), 400
    result = analysis_service.search_projects(query, limit=limit)
    return jsonify(result)

@app.route('/api/finance', methods=['GET'])
def get_finance():
    """Get finance data"""
    ticker = request.args.get('ticker', None)
    result = analysis_service.get_all_finance(ticker=ticker)
    return jsonify(result)

@app.route('/api/finance/<ticker>', methods=['GET'])
def get_finance_by_ticker(ticker):
    """Get finance by ticker"""
    result = analysis_service.get_finance_by_ticker(ticker)
    return jsonify(result)

@app.route('/api/news', methods=['GET'])
def get_news():
    """Get news articles"""
    limit = request.args.get('limit', 100, type=int)
    source = request.args.get('source', None)
    result = analysis_service.get_all_news(limit=limit, source=source)
    return jsonify(result)

@app.route('/api/countries', methods=['GET'])
def get_countries():
    """Get countries list"""
    result = analysis_service.get_countries()
    return jsonify(result)

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get categories list"""
    result = analysis_service.get_categories()
    return jsonify(result)

@app.route('/api/analysis/esg', methods=['POST'])
def analyze_esg():
    """Analyze ESG scores"""
    data = request.json
    tickers = data.get('tickers', None)
    result = analysis_service.analyze_esg_scores(tickers=tickers)
    return jsonify(result)

@app.route('/api/analysis/carbon-trends', methods=['GET'])
def analyze_carbon_trends():
    """Analyze carbon trends"""
    result = analysis_service.analyze_carbon_trends()
    return jsonify(result)

@app.route('/api/analysis/news-sentiment', methods=['GET'])
def analyze_news_sentiment():
    """Analyze news sentiment"""
    result = analysis_service.analyze_news_sentiment()
    return jsonify(result)

@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    logger.info(f"🚀 Starting Carbon Intelligence Backend on port {port}")
    logger.info(f"📊 Debug mode: {debug}")
    logger.info(f"🌐 WebSocket support: Enabled")
    logger.info(f"📡 Real-time updates: Every 10 seconds")
    
    socketio.run(app, host='0.0.0.0', port=port, debug=debug, use_reloader=False, allow_unsafe_werkzeug=True)
