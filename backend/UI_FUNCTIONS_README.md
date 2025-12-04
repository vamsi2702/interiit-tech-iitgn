# EcoInvest UI Functions Module

## Overview
This Python module provides all the backend logic for UI interactions in the EcoInvest application. It handles company data operations, navigation logic, theme switching, search functionality, and all other UI-related business logic.

## Features

### 🏢 Company Operations
- Get company details by ticker ID
- Search companies by name, ID, or industry
- Filter companies by ESG rating
- Sort companies by GII score
- Manage user watchlist (add/remove companies)
- Get top performing companies

### 📰 News Operations
- Get all news articles
- Filter news by sentiment (Positive/Negative/Neutral)
- Get latest news with limit
- Search news by title or content

### 🌱 Projects Operations
- Get all carbon credit projects
- Get project details by ID
- Filter projects by type
- Filter projects by location
- Get available projects with credits

### 🎨 Theme Operations
- Toggle between dark and light mode
- Set specific theme
- Get current theme setting

### 📊 Analytics & Reports
- Generate company summaries
- Get industry statistics
- Get system-wide statistics
- Get top performers

### 🧭 Navigation Functions
- Navigate to company report
- Navigate to dashboard
- Navigate to projects page

## Installation

No additional dependencies required beyond Python standard library. The module reads from JSON data files in the `src/data` directory.

## Usage

### Basic Usage

```python
from ui_functions import EcoInvestUIFunctions

# Initialize the UI functions
ui = EcoInvestUIFunctions(data_dir="../src/data")

# Get company information
company = ui.get_company_by_id("TSLA")
print(company['name'])  # Tesla, Inc.

# Search for companies
results = ui.search_companies("electric")
print(f"Found {len(results)} companies")

# Add to watchlist
result = ui.add_company_to_watchlist("MSFT")
print(result['message'])

# Toggle theme
theme_result = ui.toggle_theme()
print(f"Current theme: {theme_result['theme']}")
```

### Using Helper Functions

```python
from ui_functions import (
    EcoInvestUIFunctions,
    handle_click_company,
    handle_theme_toggle,
    handle_search,
    handle_add_to_watchlist,
    handle_projects_page
)

ui = EcoInvestUIFunctions()

# Handle company click
result = handle_click_company(ui, "TSLA")
# Returns: {"status": "success", "action": "navigate", "route": "/report/TSLA", ...}

# Handle theme toggle
result = handle_theme_toggle(ui)
# Returns: {"status": "success", "theme": "dark", "message": "..."}

# Handle search
result = handle_search(ui, "renewable")
# Returns: {"status": "success", "results": {"companies": [...], "news": [...]}}

# Add to watchlist
result = handle_add_to_watchlist(ui, "NVDA")
# Returns: {"status": "success", "message": "Added NVIDIA to watchlist", ...}
```

## API Reference

### Class: `EcoInvestUIFunctions`

#### Navigation Methods

- `navigate_to_company_report(company_id: str) -> Dict`
- `navigate_to_dashboard() -> Dict`
- `navigate_to_projects() -> Dict`

#### Company Methods

- `get_company_by_id(company_id: str) -> Optional[Dict]`
- `get_all_companies() -> List[Dict]`
- `search_companies(query: str) -> List[Dict]`
- `filter_companies_by_esg(min_rating: str) -> List[Dict]`
- `sort_companies_by_gii_score(ascending: bool) -> List[Dict]`
- `add_company_to_watchlist(company_id: str) -> Dict`
- `remove_company_from_watchlist(company_id: str) -> Dict`
- `get_watchlist_companies() -> List[Dict]`

#### News Methods

- `get_all_news() -> List[Dict]`
- `get_news_by_sentiment(sentiment: str) -> List[Dict]`
- `get_latest_news(limit: int) -> List[Dict]`
- `search_news(query: str) -> List[Dict]`

#### Projects Methods

- `get_all_projects() -> List[Dict]`
- `get_project_by_id(project_id: str) -> Optional[Dict]`
- `filter_projects_by_type(project_type: str) -> List[Dict]`
- `filter_projects_by_location(location: str) -> List[Dict]`
- `get_available_projects() -> List[Dict]`

#### Theme Methods

- `toggle_theme() -> Dict`
- `set_theme(theme: str) -> Dict`
- `get_current_theme() -> str`

#### Analytics Methods

- `generate_company_summary(company_id: str) -> Dict`
- `get_top_performers(limit: int) -> List[Dict]`
- `get_industry_statistics() -> Dict`
- `get_system_stats() -> Dict`

### Helper Functions

- `handle_click_company(ui, company_id: str) -> Dict`
- `handle_theme_toggle(ui) -> Dict`
- `handle_search(ui, query: str) -> Dict`
- `handle_add_to_watchlist(ui, company_id: str) -> Dict`
- `handle_projects_page(ui) -> Dict`

## Examples

### Example 1: Company Lookup and Navigation

```python
ui = EcoInvestUIFunctions()

# User clicks on Tesla
result = ui.navigate_to_company_report("TSLA")
if result['status'] == 'success':
    print(f"Navigate to: {result['route']}")
    print(f"Company: {result['data']['name']}")
    print(f"GII Score: {result['data']['gii_score']}")
```

### Example 2: Search Functionality

```python
ui = EcoInvestUIFunctions()

# User searches for "renewable energy"
companies = ui.search_companies("renewable")
news = ui.search_news("renewable")

print(f"Found {len(companies)} companies and {len(news)} news articles")
for company in companies:
    print(f"- {company['name']} ({company['id']})")
```

### Example 3: Watchlist Management

```python
ui = EcoInvestUIFunctions()

# Add companies to watchlist
ui.add_company_to_watchlist("TSLA")
ui.add_company_to_watchlist("MSFT")
ui.add_company_to_watchlist("AAPL")

# Get watchlist
watchlist = ui.get_watchlist_companies()
print(f"Your watchlist has {len(watchlist)} companies:")
for company in watchlist:
    print(f"- {company['name']}: GII {company['gii_score']}")

# Remove from watchlist
ui.remove_company_from_watchlist("AAPL")
```

### Example 4: Analytics and Reporting

```python
ui = EcoInvestUIFunctions()

# Get top performers
top_5 = ui.get_top_performers(5)
print("Top 5 Companies by GII Score:")
for i, company in enumerate(top_5, 1):
    print(f"{i}. {company['name']} - {company['gii_score']}")

# Get industry statistics
stats = ui.get_industry_statistics()
print(f"\nTotal Industries: {stats['total_industries']}")
for industry, data in stats['industries'].items():
    print(f"- {industry}: {data['count']} companies, Avg GII: {data['avg_gii_score']}")

# System stats
system_stats = ui.get_system_stats()
print(f"\nSystem Statistics:")
print(f"Total Companies: {system_stats['stats']['total_companies']}")
print(f"Average GII Score: {system_stats['stats']['avg_gii_score']}")
```

### Example 5: Theme Switching

```python
ui = EcoInvestUIFunctions()

# Toggle theme (dark -> light -> dark)
result = ui.toggle_theme()
print(f"Theme: {result['theme']}")  # light

result = ui.toggle_theme()
print(f"Theme: {result['theme']}")  # dark

# Set specific theme
ui.set_theme("light")
print(f"Current theme: {ui.get_current_theme()}")  # light
```

### Example 6: Projects Page

```python
ui = EcoInvestUIFunctions()

# Get all projects
projects = ui.get_all_projects()
print(f"Total Projects: {len(projects)}")

# Filter by type
reforestation = ui.filter_projects_by_type("Reforestation")
print(f"Reforestation Projects: {len(reforestation)}")

# Get available projects
available = ui.get_available_projects()
print(f"Projects with available credits: {len(available)}")
for project in available:
    print(f"- {project.get('name', 'N/A')}: {project.get('credits_available', 0)} credits")
```

## Running the Demo

Run the module directly to see a demonstration of all features:

```bash
cd backend
python ui_functions.py
```

This will execute various operations and display the results, showing how each function works.

## Data Files

The module expects the following JSON files in the `src/data` directory:

- `companies.json` - Company information
- `news.json` - News articles
- `projects.json` - Carbon credit projects

## Return Value Format

Most functions return dictionaries with this structure:

```python
{
    "status": "success" | "error" | "info",
    "message": "Description of what happened",
    "data": {},  # Optional: relevant data
    # ... other specific fields
}
```

## Error Handling

The module includes error handling for:
- Missing data files
- Company/project not found
- Invalid theme values
- Invalid ESG ratings

All errors return structured responses with `"status": "error"` and descriptive messages.

## Integration with Flask Backend

This module can be easily integrated with the Flask backend (aibot.py) to handle UI operations:

```python
from flask import Flask, request, jsonify
from ui_functions import EcoInvestUIFunctions, handle_click_company

app = Flask(__name__)
ui = EcoInvestUIFunctions()

@app.route('/api/company/<company_id>', methods=['GET'])
def get_company(company_id):
    result = handle_click_company(ui, company_id)
    return jsonify(result)

@app.route('/api/search', methods=['POST'])
def search():
    query = request.json.get('query', '')
    companies = ui.search_companies(query)
    return jsonify({"status": "success", "results": companies})
```

## License

Part of the EcoInvest platform.

## Author

EcoInvest Development Team
