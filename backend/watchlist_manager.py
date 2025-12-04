import json
import os

# File to simulate a database
# We use an absolute path to ensure it's found regardless of where the script is run from
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WATCHLIST_FILE = os.path.join(BASE_DIR, 'watchlist_db.json')

def load_watchlist():
    """Helper to load the watchlist from the JSON file."""
    if not os.path.exists(WATCHLIST_FILE):
        return []
    try:
        with open(WATCHLIST_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def save_watchlist(watchlist):
    """Helper to save the watchlist to the JSON file."""
    with open(WATCHLIST_FILE, 'w') as f:
        json.dump(watchlist, f, indent=2)

def add_company_to_watchlist(company_data):
    """
    Adds a company object to the watchlist.
    
    Args:
        company_data (dict): A dictionary containing company details (id, name, etc.)
    """
    watchlist = load_watchlist()
    
    # Check if company is already in the watchlist
    company_id = company_data.get('id')
    if any(c.get('id') == company_id for c in watchlist):
        print(f"Company {company_id} is already in the watchlist.")
        return False

    watchlist.append(company_data)
    save_watchlist(watchlist)
    print(f"Successfully added {company_data.get('name')} ({company_id}) to the watchlist.")
    return True

def remove_company_from_watchlist(company_id):
    """
    Removes a company from the watchlist by its ID.
    
    Args:
        company_id (str): The ID of the company to remove (e.g., 'TSLA')
    """
    watchlist = load_watchlist()
    initial_count = len(watchlist)
    
    # Filter out the company with the matching ID
    new_watchlist = [c for c in watchlist if c.get('id') != company_id]
    
    if len(new_watchlist) < initial_count:
        save_watchlist(new_watchlist)
        print(f"Successfully removed company {company_id} from the watchlist.")
        return True
    else:
        print(f"Company {company_id} was not found in the watchlist.")
        return False
