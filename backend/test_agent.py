"""
Test script for the EcoInvest AI Agent
"""
import requests
import json

def test_agent(message):
    """Send a test message to the agent"""
    url = "http://localhost:5000/api/chat"
    payload = {
        "message": message,
        "session_id": "test_session"
    }
    
    print(f"\n{'='*60}")
    print(f"USER: {message}")
    print(f"{'='*60}")
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            print(f"AGENT: {data['response']}")
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    print("Testing EcoInvest AI Agent...")
    print("Make sure the backend server is running on http://localhost:5000")
    
    # Test 1: Get company information
    test_agent("Tell me about Tesla")
    
    # Test 2: Search companies
    test_agent("Show me companies in the renewable energy sector")
    
    # Test 3: Get top performers
    test_agent("What are the top 3 performing companies?")
    
    # Test 4: Add to watchlist
    test_agent("Add Microsoft to my watchlist")
    
    # Test 5: Get watchlist
    test_agent("Show me my watchlist")
    
    # Test 6: Get latest news
    test_agent("What's the latest sustainability news?")
    
    print("\n" + "="*60)
    print("Testing complete!")
