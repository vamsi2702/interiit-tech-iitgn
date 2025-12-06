"""
Backend Analysis Service - Pathway Streaming Data Analysis

Provides comprehensive analysis and data retrieval from Pathway streaming outputs.
Uses JSONL files as the data source (projects, finance, news).
"""

import os
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from collections import defaultdict

from pathway_reader import PathwayDataReader

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BackendAnalysis:
    """Main analysis service for Carbon Intelligence data"""
    
    def __init__(self, pathway_output_dir: str = None):
        """
        Initialize Backend Analysis Service
        
        Args:
            pathway_output_dir: Path to Pathway output directory
        """
        if pathway_output_dir is None:
            pathway_output_dir = os.getenv(
                'PATHWAY_OUTPUT_DIR',
                './carbon-intelligence/server/output'
            )
        
        self.pathway_reader = PathwayDataReader(pathway_output_dir=pathway_output_dir)
        
        logger.info(f"✅ Backend Analysis initialized with Pathway reader: {pathway_output_dir}")
    
    # ========================================================================
    # PROJECTS ENDPOINTS
    # ========================================================================
    
    def get_all_projects(self, limit: int = 500, country: str = None, category: str = None) -> Dict[str, Any]:
        """Get all carbon credit projects with optional filters"""
        try:
            projects = self.pathway_reader.get_projects(country=country, limit=limit)
            
            # Apply category filter if provided
            if category:
                projects = [p for p in projects if p.get('category') == category]
            
            return {
                'success': True,
                'count': len(projects),
                'data': projects
            }
        except Exception as e:
            logger.error(f"Error getting all projects: {e}")
            return {'success': False, 'error': str(e), 'data': []}
    
    def get_project_by_id(self, project_id: str) -> Dict[str, Any]:
        """Get specific project by ID"""
        try:
            projects = self.pathway_reader.get_projects(limit=10000)
            project = next((p for p in projects if p.get('id') == project_id or p.get('project_id') == project_id), None)
            
            if project:
                return {'success': True, 'data': project}
            else:
                return {'success': False, 'error': f'Project {project_id} not found'}
        except Exception as e:
            logger.error(f"Error getting project {project_id}: {e}")
            return {'success': False, 'error': str(e)}
    
    def search_projects(self, query: str, limit: int = 100) -> Dict[str, Any]:
        """Search projects by query"""
        try:
            results = self.pathway_reader.search_projects(query=query, limit=limit)
            
            return {
                'success': True,
                'count': len(results),
                'query': query,
                'data': results
            }
        except Exception as e:
            logger.error(f"Error searching projects: {e}")
            return {'success': False, 'error': str(e), 'data': []}
    
    # ========================================================================
    # FINANCE ENDPOINTS
    # ========================================================================
    
    def get_all_finance(self, ticker: str = None) -> Dict[str, Any]:
        """Get all finance data with optional ticker filter"""
        try:
            finance_data = self.pathway_reader.get_finance(ticker=ticker)
            
            return {
                'success': True,
                'count': len(finance_data),
                'data': finance_data
            }
        except Exception as e:
            logger.error(f"Error getting finance data: {e}")
            return {'success': False, 'error': str(e), 'data': []}
    
    def get_finance_by_ticker(self, ticker: str) -> Dict[str, Any]:
        """Get finance data for specific ticker"""
        try:
            finance_data = self.pathway_reader.get_finance(ticker=ticker)
            
            if finance_data:
                return {'success': True, 'data': finance_data[0]}
            else:
                return {'success': False, 'error': f'Ticker {ticker} not found'}
        except Exception as e:
            logger.error(f"Error getting finance for {ticker}: {e}")
            return {'success': False, 'error': str(e)}
    
    # ========================================================================
    # NEWS ENDPOINTS
    # ========================================================================
    
    def get_all_news(self, limit: int = 100, source: str = None) -> Dict[str, Any]:
        """Get news articles with optional source filter"""
        try:
            news_data = self.pathway_reader.get_news(source=source, limit=limit)
            
            return {
                'success': True,
                'count': len(news_data),
                'data': news_data
            }
        except Exception as e:
            logger.error(f"Error getting news: {e}")
            return {'success': False, 'error': str(e), 'data': []}
    
    # ========================================================================
    # ANALYTICS ENDPOINTS
    # ========================================================================
    
    def get_analytics(self) -> Dict[str, Any]:
        """Get comprehensive analytics dashboard"""
        try:
            analytics = self.pathway_reader.get_analytics()
            
            return {
                'success': True,
                'analytics': analytics
            }
        except Exception as e:
            logger.error(f"Error getting analytics: {e}")
            return {'success': False, 'error': str(e), 'analytics': {}}
    
    def get_countries(self) -> Dict[str, Any]:
        """Get list of countries with project counts"""
        try:
            projects = self.pathway_reader.get_projects(limit=10000)
            
            countries = defaultdict(int)
            for p in projects:
                country = p.get('country', 'Unknown')
                countries[country] += 1
            
            sorted_countries = sorted(countries.items(), key=lambda x: x[1], reverse=True)
            
            return {
                'success': True,
                'count': len(countries),
                'data': [{'country': c[0], 'projects': c[1]} for c in sorted_countries]
            }
        except Exception as e:
            logger.error(f"Error getting countries: {e}")
            return {'success': False, 'error': str(e), 'data': []}
    
    def get_categories(self) -> Dict[str, Any]:
        """Get list of categories with project counts"""
        try:
            projects = self.pathway_reader.get_projects(limit=10000)
            
            categories = defaultdict(int)
            for p in projects:
                category = p.get('category', 'Other')
                categories[category] += 1
            
            sorted_categories = sorted(categories.items(), key=lambda x: x[1], reverse=True)
            
            return {
                'success': True,
                'count': len(categories),
                'data': [{'category': c[0], 'projects': c[1]} for c in sorted_categories]
            }
        except Exception as e:
            logger.error(f"Error getting categories: {e}")
            return {'success': False, 'error': str(e), 'data': []}
    
    # ========================================================================
    # ANALYSIS ENDPOINTS
    # ========================================================================
    
    def analyze_esg_scores(self, tickers: List[str] = None) -> Dict[str, Any]:
        """Analyze ESG scores from finance data"""
        try:
            finance_data = self.pathway_reader.get_finance()
            
            if tickers:
                finance_data = [f for f in finance_data if f.get('ticker') in tickers]
            
            # Calculate average ESG metrics
            esg_scores = [f.get('esg_score', 0) for f in finance_data if f.get('esg_score')]
            avg_esg = sum(esg_scores) / len(esg_scores) if esg_scores else 0
            
            return {
                'success': True,
                'count': len(finance_data),
                'average_esg': round(avg_esg, 2),
                'data': finance_data
            }
        except Exception as e:
            logger.error(f"Error analyzing ESG scores: {e}")
            return {'success': False, 'error': str(e)}
    
    def analyze_carbon_trends(self) -> Dict[str, Any]:
        """Analyze carbon trends from projects"""
        try:
            projects = self.pathway_reader.get_projects(limit=10000)
            
            # Group by category to analyze carbon reduction trends
            by_category = defaultdict(list)
            for p in projects:
                category = p.get('category', 'Other')
                carbon_reduction = p.get('carbon_reduction', 0)
                by_category[category].append(carbon_reduction)
            
            # Calculate averages per category
            trends = {}
            for category, reductions in by_category.items():
                trends[category] = {
                    'avg_reduction': round(sum(reductions) / len(reductions), 2),
                    'total': sum(reductions),
                    'projects': len(reductions)
                }
            
            return {
                'success': True,
                'trends': trends
            }
        except Exception as e:
            logger.error(f"Error analyzing carbon trends: {e}")
            return {'success': False, 'error': str(e)}
    
    def analyze_news_sentiment(self) -> Dict[str, Any]:
        """Analyze news sentiment distribution"""
        try:
            news_data = self.pathway_reader.get_news(limit=1000)
            
            sentiments = defaultdict(int)
            for n in news_data:
                sentiment = n.get('sentiment', 'Neutral')
                sentiments[sentiment] += 1
            
            total = sum(sentiments.values())
            
            return {
                'success': True,
                'total_articles': total,
                'sentiment_distribution': dict(sentiments),
                'percentages': {
                    s: round((c / total * 100), 2) for s, c in sentiments.items()
                } if total > 0 else {}
            }
        except Exception as e:
            logger.error(f"Error analyzing news sentiment: {e}")
            return {'success': False, 'error': str(e)}
    
    # ========================================================================
    # HEALTH CHECK
    # ========================================================================
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get service health status"""
        try:
            # Try to read some data to verify system is working
            projects = self.pathway_reader.get_projects(limit=1)
            finance = self.pathway_reader.get_finance()
            news = self.pathway_reader.get_news(limit=1)
            
            return {
                'status': 'healthy',
                'service': 'carbon-intelligence-backend',
                'components': {
                    'projects': 'ok' if projects else 'warning',
                    'finance': 'ok' if finance else 'warning',
                    'news': 'ok' if news else 'warning'
                },
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {
                'status': 'unhealthy',
                'service': 'carbon-intelligence-backend',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }


# Global instance
_backend_analysis = None

def get_backend_analysis(pathway_output_dir: str = None) -> BackendAnalysis:
    """Get or create singleton backend analysis instance"""
    global _backend_analysis
    
    if _backend_analysis is None:
        _backend_analysis = BackendAnalysis(pathway_output_dir=pathway_output_dir)
    
    return _backend_analysis
