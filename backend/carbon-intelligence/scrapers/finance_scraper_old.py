import time
import random

import psycopg2
import yfinance as yf

conn = psycopg2.connect(
    dbname="carbon_intel",
    user="carbon",
    password="carbonpw",
    host="postgres",  # THIS MUST MATCH SERVICE NAME
    port=5432,
)
cur = conn.cursor()

# Company metadata matching frontend format
COMPANY_METADATA = {
    "TSLA": {
        "name": "Tesla, Inc.",
        "industry": "Automotive & Energy",
        "description": "Leading electric vehicle manufacturer and clean energy company producing EVs, battery energy storage systems, and solar products.",
        "gii_score": 89,
        "sustainability_update": "Announced plans to power all Gigafactories with 100% renewable energy by 2026.",
        "esg_rating": "A",
        "website": "https://www.tesla.com"
    },
    "MSFT": {
        "name": "Microsoft Corporation",
        "industry": "Technology",
        "description": "Global technology leader providing cloud computing, software, devices, and services.",
        "gii_score": 92,
        "sustainability_update": "Achieved 100% renewable energy in all data centers globally.",
        "esg_rating": "AAA",
        "website": "https://www.microsoft.com"
    },
    "NVDA": {
        "name": "NVIDIA Corporation",
        "industry": "Semiconductors",
        "description": "Pioneer in GPU technology and AI computing platforms.",
        "gii_score": 85,
        "sustainability_update": "Launched Earth-2 climate digital twin initiative.",
        "esg_rating": "A+",
        "website": "https://www.nvidia.com"
    },
    "AAPL": {
        "name": "Apple Inc.",
        "industry": "Technology",
        "description": "Designer and manufacturer of consumer electronics, software, and online services.",
        "gii_score": 94,
        "sustainability_update": "Launched first carbon-neutral product line with Apple Watch Series 9.",
        "esg_rating": "AAA",
        "website": "https://www.apple.com"
    },
    "GOOGL": {
        "name": "Alphabet Inc.",
        "industry": "Technology",
        "description": "Technology conglomerate specializing in internet services and products.",
        "gii_score": 90,
        "sustainability_update": "Operating on 24/7 carbon-free energy in multiple data centers.",
        "esg_rating": "AA+",
        "website": "https://about.google"
    },
    "AMZN": {
        "name": "Amazon.com, Inc.",
        "industry": "E-commerce & Cloud",
        "description": "Global e-commerce and cloud computing giant.",
        "gii_score": 82,
        "sustainability_update": "Committed to net-zero carbon by 2040 with 100,000+ electric delivery vehicles.",
        "esg_rating": "A",
        "website": "https://www.amazon.com"
    },
    "ORCL": {
        "name": "Oracle Corporation",
        "industry": "Technology",
        "description": "Enterprise software and cloud infrastructure provider.",
        "gii_score": 81,
        "sustainability_update": "Surpassed 90% renewable energy across global operations.",
        "esg_rating": "A",
        "website": "https://www.oracle.com"
    }
}


def run_finance_scraper(tickers):
    """
    Scrape financial data for multiple tickers with full company metadata
    Will wait and retry to get REAL data from Yahoo Finance
    
    Args:
        tickers: List of stock ticker symbols to track
    """
    print(f"💰 Fetching REAL data for {len(tickers)} tickers (this may take time)...")
    
    successful = 0
    failed = 0
    
    # Prioritize important tickers
    priority_tickers = ["TSLA", "MSFT", "NVDA", "AAPL", "GOOGL", "AMZN", "ORCL"]
    other_tickers = [t for t in tickers if t not in priority_tickers]
    ordered_tickers = priority_tickers + other_tickers[:10]  # Limit to avoid rate limits
    
    for idx, ticker_symbol in enumerate(ordered_tickers):
        try:
            # Add longer delay to avoid rate limiting - be patient for real data
            if idx > 0:
                delay = random.uniform(3, 6)  # Increased delay
                print(f"⏳ Waiting {delay:.1f}s before next request...")
                time.sleep(delay)
            
            # Get metadata first
            metadata = COMPANY_METADATA.get(ticker_symbol)
            
            if not metadata:
                # Skip tickers without metadata
                print(f"⚠️  Skipping {ticker_symbol} (no metadata)")
                continue
            
            print(f"📊 Fetching {ticker_symbol}...")
            
            # Try multiple times to get real data
            max_retries = 3
            hist = None
            info = None
            
            for attempt in range(max_retries):
                try:
                    # Create fresh ticker object each time
                    ticker = yf.Ticker(ticker_symbol)
                    
                    # Try to get info first (has price data)
                    info = ticker.info
                    
                    # Get historical data
                    hist = ticker.history(period="5d")  # Get 5 days for better data
                    
                    if not hist.empty and info:
                        break  # Success!
                    
                    if attempt < max_retries - 1:
                        wait_time = (attempt + 1) * 5  # Exponential backoff
                        print(f"  ⏳ Retry {attempt + 1}/{max_retries} in {wait_time}s...")
                        time.sleep(wait_time)
                        
                except Exception as e:
                    if attempt < max_retries - 1:
                        wait_time = (attempt + 1) * 5
                        print(f"  ⚠️  Error: {str(e)[:50]}, retrying in {wait_time}s...")
                        time.sleep(wait_time)
                    else:
                        print(f"  ❌ Failed after {max_retries} attempts")
            
            # Process the data
            if hist is not None and not hist.empty:
                price = float(hist["Close"].iloc[-1])
                volume = int(hist["Volume"].iloc[-1]) if "Volume" in hist else 0
                
                # Calculate change percent
                if len(hist) > 1:
                    prev_close = float(hist["Close"].iloc[-2])
                    change_percent = ((price - prev_close) / prev_close) * 100
                else:
                    change_percent = 0.0
                
                # Get market cap from info
                market_cap_value = info.get("marketCap", 0) if info else 0
                
                print(f"  ✅ Got REAL data: ${price:.2f} (vol: {volume:,})")
            else:
                print(f"  ⚠️  Could not fetch {ticker_symbol} after retries, skipping...")
                failed += 1
                continue
            
            # Format market cap
            if market_cap_value >= 1e12:
                market_cap = f"{market_cap_value / 1e12:.1f}T"
            elif market_cap_value >= 1e9:
                market_cap = f"{market_cap_value / 1e9:.0f}B"
            elif market_cap_value > 0:
                market_cap = f"{market_cap_value / 1e6:.0f}M"
            else:
                market_cap = "N/A"

            cur.execute(
                """
                    INSERT INTO finance (
                        ticker, company_name, industry, description, gii_score,
                        stock_price, market_cap, sustainability_update, esg_rating,
                        website, price, volume, change_percent, timestamp
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (ticker) DO UPDATE SET
                        stock_price=EXCLUDED.stock_price,
                        price=EXCLUDED.price,
                        volume=EXCLUDED.volume,
                        market_cap=EXCLUDED.market_cap,
                        change_percent=EXCLUDED.change_percent,
                        timestamp=EXCLUDED.timestamp,
                        updated_at=NOW();
                """,
                (
                    ticker_symbol,
                    metadata["name"],
                    metadata["industry"],
                    metadata["description"],
                    metadata["gii_score"],
                    float(price),
                    market_cap,
                    metadata["sustainability_update"],
                    metadata["esg_rating"],
                    metadata["website"],
                    float(price),
                    volume,
                    float(change_percent),
                    int(time.time())
                ),
            )
            conn.commit()
            successful += 1
            print(f"✅ {ticker_symbol}: ${price:.2f}")
                
        except Exception as e:
            print(f"❌ Error processing {ticker_symbol}: {e}")
            failed += 1
            continue
    
    print(f"✅ Finance scraper: {successful} successful, {failed} failed")
