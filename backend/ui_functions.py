"""
EcoInvest UI Functions Module
==============================
This module contains all the backend logic for UI interactions in the EcoInvest application.
It handles company data operations, navigation logic, theme switching, search functionality,
and all other UI-related business logic.
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Any


class EcoInvestUIFunctions:
    """Main class handling all UI-related functions for EcoInvest platform"""
    
    def __init__(self, data_dir: str = "../src/data"):
        """
        Initialize UI Functions with data directory
        
        Args:
            data_dir: Path to the data directory containing JSON files
        """
        self.data_dir = data_dir
        self.companies = self._load_companies()
        self.news = self._load_news()
        self.projects = self._load_projects()
        self.current_theme = "dark"  # Default theme
        self.watchlist = []  # User's watchlist
        
    def _load_companies(self) -> List[Dict]:
        """Load companies data from JSON file"""
        try:
            file_path = os.path.join(self.data_dir, "companies.json")
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: Companies file not found at {file_path}")
            return []
    
    def _load_news(self) -> List[Dict]:
        """Load news data from JSON file"""
        try:
            file_path = os.path.join(self.data_dir, "news.json")
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: News file not found at {file_path}")
            return []
    
    def _load_projects(self) -> List[Dict]:
        """Load projects data from JSON file"""
        try:
            file_path = os.path.join(self.data_dir, "projects.json")
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: Projects file not found at {file_path}")
            return []
    
    # ==================== NAVIGATION FUNCTIONS ====================
    
    def navigate_to_company_report(self, company_id: str) -> Dict[str, Any]:
        """
        Handle navigation to company report page
        
        Args:
            company_id: Company ticker symbol (e.g., "TSLA", "MSFT")
            
        Returns:
            Dict with navigation status and company data
        """
        company = self.get_company_by_id(company_id)
        
        if company:
            return {
                "status": "success",
                "action": "navigate",
                "route": f"/report/{company_id}",
                "data": company,
                "message": f"Navigating to {company['name']} report"
            }
        else:
            return {
                "status": "error",
                "message": f"Company with ID {company_id} not found"
            }
    
    def navigate_to_dashboard(self) -> Dict[str, Any]:
        """Navigate to main dashboard"""
        return {
            "status": "success",
            "action": "navigate",
            "route": "/",
            "message": "Navigating to dashboard"
        }
    
    def navigate_to_projects(self) -> Dict[str, Any]:
        """Navigate to projects page"""
        return {
            "status": "success",
            "action": "navigate",
            "route": "/projects",
            "data": self.projects,
            "message": "Navigating to projects page"
        }
    
    # ==================== COMPANY OPERATIONS ====================
    
    def get_company_by_id(self, company_id: str) -> Optional[Dict]:
        """
        Get company details by ID
        
        Args:
            company_id: Company ticker symbol
            
        Returns:
            Company data dict or None if not found
        """
        for company in self.companies:
            if company["id"].upper() == company_id.upper():
                return company
        return None
    
    def get_all_companies(self) -> List[Dict]:
        """Get all companies in the system"""
        return self.companies
    
    def search_companies(self, query: str) -> List[Dict]:
        """
        Search companies by name, ID, or industry
        
        Args:
            query: Search query string
            
        Returns:
            List of matching companies
        """
        query_lower = query.lower()
        results = []
        
        for company in self.companies:
            if (query_lower in company["name"].lower() or
                query_lower in company["id"].lower() or
                query_lower in company.get("industry", "").lower()):
                results.append(company)
        
        return results
    
    def filter_companies_by_esg(self, min_rating: str = "A") -> List[Dict]:
        """
        Filter companies by minimum ESG rating
        
        Args:
            min_rating: Minimum ESG rating (AAA, AA, A, etc.)
            
        Returns:
            List of companies meeting criteria
        """
        rating_order = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "CC", "C"]
        min_index = rating_order.index(min_rating) if min_rating in rating_order else len(rating_order)
        
        filtered = []
        for company in self.companies:
            rating = company.get("esg_rating", "C")
            if rating in rating_order and rating_order.index(rating) <= min_index:
                filtered.append(company)
        
        return filtered
    
    def sort_companies_by_gii_score(self, ascending: bool = False) -> List[Dict]:
        """
        Sort companies by GII score
        
        Args:
            ascending: Sort in ascending order if True, descending if False
            
        Returns:
            Sorted list of companies
        """
        return sorted(self.companies, key=lambda x: x.get("gii_score", 0), reverse=not ascending)
    
    def add_company_to_watchlist(self, company_id: str) -> Dict[str, Any]:
        """
        Add a company to user's watchlist
        
        Args:
            company_id: Company ticker symbol
            
        Returns:
            Operation result
        """
        company = self.get_company_by_id(company_id)
        
        if not company:
            return {
                "status": "error",
                "message": f"Company {company_id} not found"
            }
        
        if company_id.upper() in [c.upper() for c in self.watchlist]:
            return {
                "status": "info",
                "message": f"{company['name']} is already in your watchlist"
            }
        
        self.watchlist.append(company_id.upper())
        return {
            "status": "success",
            "message": f"Added {company['name']} to watchlist",
            "watchlist": self.watchlist
        }
    
    def remove_company_from_watchlist(self, company_id: str) -> Dict[str, Any]:
        """
        Remove a company from user's watchlist
        
        Args:
            company_id: Company ticker symbol
            
        Returns:
            Operation result
        """
        company_id_upper = company_id.upper()
        
        if company_id_upper in [c.upper() for c in self.watchlist]:
            self.watchlist = [c for c in self.watchlist if c.upper() != company_id_upper]
            return {
                "status": "success",
                "message": f"Removed {company_id} from watchlist",
                "watchlist": self.watchlist
            }
        
        return {
            "status": "error",
            "message": f"{company_id} not found in watchlist"
        }
    
    def get_watchlist_companies(self) -> List[Dict]:
        """Get full details of companies in watchlist"""
        return [self.get_company_by_id(cid) for cid in self.watchlist if self.get_company_by_id(cid)]
    
    # ==================== NEWS OPERATIONS ====================
    
    def get_all_news(self) -> List[Dict]:
        """Get all news articles"""
        return self.news
    
    def get_news_by_sentiment(self, sentiment: str) -> List[Dict]:
        """
        Filter news by sentiment
        
        Args:
            sentiment: "Positive", "Negative", or "Neutral"
            
        Returns:
            Filtered news articles
        """
        return [article for article in self.news if article.get("sentiment") == sentiment]
    
    def get_latest_news(self, limit: int = 5) -> List[Dict]:
        """
        Get latest news articles
        
        Args:
            limit: Number of articles to return
            
        Returns:
            Most recent news articles
        """
        sorted_news = sorted(self.news, key=lambda x: x.get("date", ""), reverse=True)
        return sorted_news[:limit]
    
    def search_news(self, query: str) -> List[Dict]:
        """
        Search news articles by title or content
        
        Args:
            query: Search query
            
        Returns:
            Matching news articles
        """
        query_lower = query.lower()
        results = []
        
        for article in self.news:
            if (query_lower in article.get("title", "").lower() or
                query_lower in article.get("summary", "").lower()):
                results.append(article)
        
        return results
    
    # ==================== PROJECTS OPERATIONS ====================
    
    def get_all_projects(self) -> List[Dict]:
        """Get all carbon credit projects"""
        return self.projects
    
    def get_project_by_id(self, project_id: str) -> Optional[Dict]:
        """
        Get project details by ID
        
        Args:
            project_id: Project identifier
            
        Returns:
            Project data or None
        """
        for project in self.projects:
            if project.get("id") == project_id:
                return project
        return None
    
    def filter_projects_by_type(self, project_type: str) -> List[Dict]:
        """
        Filter projects by type
        
        Args:
            project_type: Type of project (e.g., "Reforestation", "Renewable Energy")
            
        Returns:
            Filtered projects
        """
        return [p for p in self.projects if p.get("type") == project_type]
    
    def filter_projects_by_location(self, location: str) -> List[Dict]:
        """
        Filter projects by location
        
        Args:
            location: Location/country name
            
        Returns:
            Projects in specified location
        """
        location_lower = location.lower()
        return [p for p in self.projects 
                if location_lower in p.get("location", "").lower()]
    
    def get_available_projects(self) -> List[Dict]:
        """Get projects with available credits"""
        return [p for p in self.projects 
                if p.get("status") == "Active" and p.get("credits_available", 0) > 0]
    
    # ==================== THEME OPERATIONS ====================
    
    def toggle_theme(self) -> Dict[str, str]:
        """
        Toggle between dark and light theme
        
        Returns:
            Current theme after toggle
        """
        self.current_theme = "light" if self.current_theme == "dark" else "dark"
        return {
            "status": "success",
            "theme": self.current_theme,
            "message": f"Theme switched to {self.current_theme} mode"
        }
    
    def set_theme(self, theme: str) -> Dict[str, str]:
        """
        Set specific theme
        
        Args:
            theme: "dark" or "light"
            
        Returns:
            Theme status
        """
        if theme in ["dark", "light"]:
            self.current_theme = theme
            return {
                "status": "success",
                "theme": self.current_theme,
                "message": f"Theme set to {theme} mode"
            }
        else:
            return {
                "status": "error",
                "message": f"Invalid theme: {theme}. Use 'dark' or 'light'"
            }
    
    def get_current_theme(self) -> str:
        """Get current theme setting"""
        return self.current_theme
    
    # ==================== ANALYTICS & REPORTS ====================
    
    def generate_company_summary(self, company_id: str) -> Dict[str, Any]:
        """
        Generate a summary report for a company
        
        Args:
            company_id: Company ticker symbol
            
        Returns:
            Company summary with key metrics
        """
        company = self.get_company_by_id(company_id)
        
        if not company:
            return {
                "status": "error",
                "message": f"Company {company_id} not found"
            }
        
        return {
            "status": "success",
            "company_id": company["id"],
            "name": company["name"],
            "industry": company["industry"],
            "metrics": {
                "gii_score": company["gii_score"],
                "esg_rating": company["esg_rating"],
                "stock_price": company["stock_price"],
                "market_cap": company["market_cap"]
            },
            "sustainability_update": company["sustainability_update"],
            "website": company.get("website", "N/A")
        }
    
    def get_top_performers(self, limit: int = 10) -> List[Dict]:
        """
        Get top performing companies by GII score
        
        Args:
            limit: Number of companies to return
            
        Returns:
            Top performing companies
        """
        sorted_companies = self.sort_companies_by_gii_score()
        return sorted_companies[:limit]
    
    def get_industry_statistics(self) -> Dict[str, Any]:
        """
        Get statistics grouped by industry
        
        Returns:
            Industry-wise statistics
        """
        industries = {}
        
        for company in self.companies:
            industry = company.get("industry", "Unknown")
            if industry not in industries:
                industries[industry] = {
                    "count": 0,
                    "avg_gii_score": 0,
                    "companies": []
                }
            
            industries[industry]["count"] += 1
            industries[industry]["companies"].append(company["id"])
            industries[industry]["avg_gii_score"] += company.get("gii_score", 0)
        
        # Calculate averages
        for industry in industries:
            count = industries[industry]["count"]
            if count > 0:
                industries[industry]["avg_gii_score"] /= count
                industries[industry]["avg_gii_score"] = round(industries[industry]["avg_gii_score"], 2)
        
        return {
            "status": "success",
            "total_industries": len(industries),
            "industries": industries
        }
    
    # ==================== UTILITY FUNCTIONS ====================
    
    def format_date(self, date_string: str) -> str:
        """
        Format date string to readable format
        
        Args:
            date_string: ISO format date string
            
        Returns:
            Formatted date string
        """
        try:
            date_obj = datetime.fromisoformat(date_string.replace('Z', '+00:00'))
            return date_obj.strftime("%B %d, %Y")
        except Exception:
            return date_string
    
    def get_system_stats(self) -> Dict[str, Any]:
        """
        Get overall system statistics
        
        Returns:
            System-wide statistics
        """
        return {
            "status": "success",
            "stats": {
                "total_companies": len(self.companies),
                "total_news": len(self.news),
                "total_projects": len(self.projects),
                "watchlist_count": len(self.watchlist),
                "current_theme": self.current_theme,
                "avg_gii_score": round(sum(c.get("gii_score", 0) for c in self.companies) / len(self.companies), 2) if self.companies else 0
            }
        }


# ==================== STANDALONE HELPER FUNCTIONS ====================

def handle_click_company(ui: EcoInvestUIFunctions, company_id: str) -> Dict[str, Any]:
    """
    Handle when user clicks on a company name
    
    Args:
        ui: EcoInvestUIFunctions instance
        company_id: Company ticker symbol
        
    Returns:
        Navigation result
    """
    return ui.navigate_to_company_report(company_id)


def handle_theme_toggle(ui: EcoInvestUIFunctions) -> Dict[str, str]:
    """
    Handle theme toggle button click
    
    Args:
        ui: EcoInvestUIFunctions instance
        
    Returns:
        New theme status
    """
    return ui.toggle_theme()


def handle_search(ui: EcoInvestUIFunctions, query: str) -> Dict[str, Any]:
    """
    Handle search functionality
    
    Args:
        ui: EcoInvestUIFunctions instance
        query: Search query
        
    Returns:
        Search results
    """
    companies = ui.search_companies(query)
    news = ui.search_news(query)
    
    return {
        "status": "success",
        "query": query,
        "results": {
            "companies": companies,
            "news": news,
            "total": len(companies) + len(news)
        }
    }


def handle_add_to_watchlist(ui: EcoInvestUIFunctions, company_id: str) -> Dict[str, Any]:
    """
    Handle adding company to watchlist
    
    Args:
        ui: EcoInvestUIFunctions instance
        company_id: Company ticker symbol
        
    Returns:
        Operation result
    """
    return ui.add_company_to_watchlist(company_id)


def handle_projects_page(ui: EcoInvestUIFunctions) -> Dict[str, Any]:
    """
    Handle navigation to projects page
    
    Args:
        ui: EcoInvestUIFunctions instance
        
    Returns:
        Projects page data
    """
    result = ui.navigate_to_projects()
    result["stats"] = {
        "total_projects": len(ui.projects),
        "active_projects": len([p for p in ui.projects if p.get("status") == "Active"]),
        "available_credits": sum(p.get("credits_available", 0) for p in ui.projects)
    }
    return result


# ==================== DEMO USAGE ====================

if __name__ == "__main__":
    # Initialize the UI functions
    print("=== EcoInvest UI Functions Demo ===\n")
    
    ui = EcoInvestUIFunctions()
    
    # Demo 1: Click on company
    print("1. Clicking on Tesla:")
    result = handle_click_company(ui, "TSLA")
    print(f"   Status: {result['status']}")
    print(f"   Action: {result['action']} to {result['route']}")
    print(f"   Company: {result['data']['name']}\n")
    
    # Demo 2: Toggle theme
    print("2. Toggling theme:")
    result = handle_theme_toggle(ui)
    print(f"   New theme: {result['theme']}\n")
    
    # Demo 3: Search companies
    print("3. Searching for 'Tesla':")
    result = handle_search(ui, "Tesla")
    print(f"   Found {result['results']['total']} results")
    print(f"   Companies: {len(result['results']['companies'])}")
    print(f"   News: {len(result['results']['news'])}\n")
    
    # Demo 4: Add to watchlist
    print("4. Adding Microsoft to watchlist:")
    result = handle_add_to_watchlist(ui, "MSFT")
    print(f"   Status: {result['status']}")
    print(f"   Message: {result['message']}\n")
    
    # Demo 5: Get top performers
    print("5. Top 5 performers by GII score:")
    top_performers = ui.get_top_performers(5)
    for i, company in enumerate(top_performers, 1):
        print(f"   {i}. {company['name']} - GII: {company['gii_score']}")
    print()
    
    # Demo 6: Get system stats
    print("6. System Statistics:")
    stats = ui.get_system_stats()
    for key, value in stats['stats'].items():
        print(f"   {key}: {value}")
    print()
    
    # Demo 7: Navigate to projects
    print("7. Navigating to projects:")
    result = handle_projects_page(ui)
    print(f"   Status: {result['status']}")
    print(f"   Route: {result['route']}")
    print(f"   Total projects: {result['stats']['total_projects']}")
    print(f"   Active projects: {result['stats']['active_projects']}")
