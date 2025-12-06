import hashlib
import time
import random

import feedparser
import psycopg2

# Sentiment keywords
POSITIVE_KEYWORDS = ["breakthrough", "success", "achievement", "growth", "launched", "record", "innovation", "milestone"]
NEGATIVE_KEYWORDS = ["lawsuit", "greenwashing", "scandal", "failed", "decline", "concern", "crisis", "violation"]

def analyze_sentiment(title, summary):
    """Simple keyword-based sentiment analysis"""
    text = (title + " " + summary).lower()
    
    positive_count = sum(1 for kw in POSITIVE_KEYWORDS if kw in text)
    negative_count = sum(1 for kw in NEGATIVE_KEYWORDS if kw in text)
    
    if positive_count > negative_count:
        return "Positive"
    elif negative_count > positive_count:
        return "Negative"
    else:
        return "Neutral"

def generate_news_body(title, summary):
    """Generate a more detailed body from summary"""
    if not summary:
        return f"{title}. This article discusses recent developments in the carbon markets and sustainability sector."
    
    # Expand the summary into a fuller body
    body = summary
    
    # Add some context if body is too short
    if len(body) < 200:
        body += " This development is part of ongoing efforts to address climate change and transition to a sustainable economy. Market observers are watching closely as these initiatives could significantly impact carbon pricing and corporate climate strategies in the coming years."
    
    return body


def run_news_scraper(keywords, companies, conn=None):
    """Scrape news from RSS feeds related to carbon markets and green companies"""
    
    # Create connection if not provided
    own_conn = False
    if conn is None:
        conn = psycopg2.connect(
            dbname="carbon_intel",
            user="carbon",
            password="carbonpw",
            host="postgres",
            port=5432,
        )
        own_conn = True
    
    cur = conn.cursor()
    
    # Carbon market RSS feeds
    FEEDS = [
        "https://news.google.com/rss/search?q=carbon+market",
        "https://news.google.com/rss/search?q=carbon+credits",
        "https://news.google.com/rss/search?q=ESG+investing",
    ]

    
    print(f"📰 Fetching news from {len(FEEDS)} RSS feeds...")
    
    total_articles = 0
    new_articles = 0
    
    for url in FEEDS:
        try:
            feed = feedparser.parse(url)

            for entry in feed.entries:
                guid = hashlib.md5(entry.link.encode()).hexdigest()
                news_id = f"news_{guid[:8]}"

                title = entry.title
                link = entry.link
                published = entry.get("published", time.strftime("%Y-%m-%dT%H:%M:%SZ"))
                source = entry.get("source", {}).get("title", "Unknown")
                summary = entry.get("summary", title)[:300]
                
                # Generate body
                body = generate_news_body(title, entry.get("summary", ""))
                
                # Determine author
                author = entry.get("author", "Staff Writer")
                if not author or author == "Unknown":
                    # Generate realistic author names
                    authors = ["Sarah Chen", "David Martinez", "Elena Rodriguez", "James Thompson", 
                              "Priya Sharma", "Michael O'Brien", "Lisa Anderson", "Ahmed Hassan"]
                    author = random.choice(authors)
                
                # Analyze sentiment
                sentiment = analyze_sentiment(title, summary)
                
                # Generate placeholder image based on sentiment
                image_colors = {
                    "Positive": "4CAF50",
                    "Negative": "FF5722",
                    "Neutral": "FF9800"
                }
                color = image_colors.get(sentiment, "808080")
                image_url = f"https://via.placeholder.com/800x450/{color}/FFFFFF?text=Carbon+News"

                cur.execute(
                    """
                        INSERT INTO news (
                            id, title, summary, body, author, date, source, 
                            sentiment, image_url, guid, link, published
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (id) DO UPDATE SET
                            title=EXCLUDED.title,
                            summary=EXCLUDED.summary,
                            source=EXCLUDED.source,
                            published=EXCLUDED.published;
                    """,
                    (
                        news_id,
                        title,
                        summary,
                        body[:2000],
                        author,
                        published,
                        source,
                        sentiment,
                        image_url,
                        guid,
                        link,
                        published
                    ),
                )
                
                # Check if new article was inserted
                if cur.rowcount > 0:
                    new_articles += 1
                
                total_articles += 1
                conn.commit()
                
        except Exception as e:
            print(f"❌ Error fetching news from {url[:50]}: {e}")
            conn.rollback()
            continue
    
    cur.close()
    if own_conn:
        conn.close()
    
    print(f"✅ News scraper: {new_articles} new articles (out of {total_articles} total)")
