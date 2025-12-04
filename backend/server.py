from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add the current directory to sys.path so we can import watchlist_manager
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# Also add the parent directory just in case
sys.path.append(os.path.dirname(current_dir))

try:
    import watchlist_manager
except ImportError:
    # Fallback for when running from root
    from backend import watchlist_manager

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/watchlist', methods=['GET'])
def get_watchlist():
    """Get the current watchlist."""
    watchlist = watchlist_manager.load_watchlist()
    return jsonify(watchlist)

@app.route('/api/watchlist', methods=['POST'])
def add_to_watchlist():
    """Add a company to the watchlist."""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    success = watchlist_manager.add_company_to_watchlist(data)
    if success:
        return jsonify({"message": "Company added successfully", "company": data}), 201
    else:
        return jsonify({"message": "Company already in watchlist"}), 200

@app.route('/api/watchlist/<company_id>', methods=['DELETE'])
def remove_from_watchlist(company_id):
    """Remove a company from the watchlist."""
    success = watchlist_manager.remove_company_from_watchlist(company_id)
    if success:
        return jsonify({"message": "Company removed successfully"}), 200
    else:
        return jsonify({"error": "Company not found"}), 404

if __name__ == '__main__':
    print("Starting Flask server on http://localhost:5000")
    app.run(debug=True, port=5000)
