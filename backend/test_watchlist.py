"""
Test script to verify watchlist persistence in the agent
"""
import requests
import time

BASE_URL = "http://localhost:5000"
SESSION_ID = "test-session-123"

def send_message(message, session_id=SESSION_ID):
    """Send a message to the agent"""
    response = requests.post(
        f"{BASE_URL}/api/chat",
        json={"message": message, "session_id": session_id}
    )
    if response.status_code == 200:
        result = response.json()
        print(f"\n{'='*60}")
        print(f"USER: {message}")
        print(f"{'='*60}")
        print(f"AGENT: {result['response']}")
        print(f"{'='*60}\n")
        return result
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

def test_watchlist_persistence():
    """Test that watchlist persists across multiple requests"""
    print("Starting Watchlist Persistence Test...")
    print(f"Using Session ID: {SESSION_ID}\n")
    
    # Test 1: Check empty watchlist
    print("Test 1: Check empty watchlist")
    send_message("show me my watchlist")
    time.sleep(2)
    
    # Test 2: Add TSLA to watchlist
    print("\nTest 2: Add TSLA to watchlist")
    send_message("add TSLA to my watchlist")
    time.sleep(2)
    
    # Test 3: Verify TSLA is in watchlist
    print("\nTest 3: Verify TSLA is in watchlist")
    send_message("what's in my watchlist?")
    time.sleep(2)
    
    # Test 4: Add MSFT to watchlist
    print("\nTest 4: Add MSFT to watchlist")
    send_message("also add MSFT to my watchlist")
    time.sleep(2)
    
    # Test 5: Verify both companies are in watchlist
    print("\nTest 5: Verify both TSLA and MSFT are in watchlist")
    send_message("show my watchlist")
    time.sleep(2)
    
    # Test 6: Remove TSLA
    print("\nTest 6: Remove TSLA from watchlist")
    send_message("remove TSLA from my watchlist")
    time.sleep(2)
    
    # Test 7: Verify only MSFT remains
    print("\nTest 7: Verify only MSFT remains in watchlist")
    send_message("what companies am I watching?")
    time.sleep(2)
    
    print("\n" + "="*60)
    print("Test Complete!")
    print("="*60)

if __name__ == "__main__":
    test_watchlist_persistence()
