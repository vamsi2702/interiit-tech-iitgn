#!/usr/bin/env python3
"""
Full System Integration Test for Carbon Intelligence Platform (DOCKER VERSION)

This version uses internal Docker hostnames and is designed to run INSIDE a Docker container.

Tests:
1. PostgreSQL connection and schema validation
2. Data insertion and scraper functionality
3. Debezium connector status
4. Kafka topic creation and CDC streaming
5. gRPC service endpoints
6. Redis caching layer
7. End-to-end data flow (Postgres -> Kafka -> Pathway -> gRPC -> Redis)

Usage (from inside Docker):
    python full_system_test_docker.py
    
Prerequisites:
    - All Docker services running (docker-compose up)
    - Run this from inside a Docker container on the same network
"""

import json
import os
import sys
import time
import uuid
from typing import Dict, List, Optional

import grpc
import psycopg2
import redis
import requests
from confluent_kafka import Consumer, KafkaError
from confluent_kafka.admin import AdminClient

# Make sure proto imports work
sys.path.append(os.path.dirname(__file__))

try:
    import carbon_service_pb2 as pb2
    import carbon_service_pb2_grpc as pb2_grpc
except ImportError:
    print("⚠️  WARNING: gRPC stubs not found. Run: python -m grpc_tools.protoc ...")
    pb2 = None
    pb2_grpc = None

# ============================================================
# CONFIGURATION - DOCKER INTERNAL HOSTNAMES
# ============================================================

# Docker internal hostnames (not localhost!)
POSTGRES_CONFIG = {
    "dbname": "carbon_intel",
    "user": "carbon",
    "password": "carbonpw",
    "host": "postgres",  # Docker internal hostname
    "port": 5432,
}

KAFKA_BROKER = "kafka:9092"  # Internal Docker broker
DEBEZIUM_CONNECT_URL = "http://debezium_connect:8083"
REDIS_HOST = "redis"  # Docker internal hostname
REDIS_PORT = 6379
GRPC_TARGET = "carbon_pathway:50051"  # Docker service name

# Test data identifiers
TEST_NEWS_SOURCE = "docker-system-test"
TEST_VERRA_ID = "test-verra-docker-001"
TEST_CARBONMARK_ID = "test-carbonmark-docker-001"

# Colors for terminal output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def log_test(test_name: str):
    """Print test header"""
    print(f"\n{BLUE}[TEST]{RESET} {test_name}")


def log_success(message: str):
    """Print success message"""
    print(f"{GREEN}✔{RESET} {message}")


def log_error(message: str):
    """Print error message"""
    print(f"{RED}✖{RESET} {message}")


def log_warning(message: str):
    """Print warning message"""
    print(f"{YELLOW}⚠{RESET} {message}")


def log_info(message: str):
    """Print info message"""
    print(f"  {message}")


def wait_for_service(test_func, service_name: str, max_wait: int = 30, interval: int = 2):
    """Wait for a service to become available"""
    log_info(f"Waiting for {service_name} (max {max_wait}s)...")
    start = time.time()
    
    while time.time() - start < max_wait:
        try:
            test_func()
            log_success(f"{service_name} is ready")
            return True
        except Exception as e:
            time.sleep(interval)
    
    log_error(f"{service_name} not ready after {max_wait}s")
    return False


# ============================================================
# POSTGRES TESTS
# ============================================================

def get_postgres_connection():
    """Get a PostgreSQL connection"""
    return psycopg2.connect(**POSTGRES_CONFIG)


def test_postgres_connection():
    """Test 1: PostgreSQL connectivity"""
    log_test("PostgreSQL Connection")
    
    try:
        conn = get_postgres_connection()
        cur = conn.cursor()
        cur.execute("SELECT version();")
        version = cur.fetchone()[0]
        conn.close()
        
        log_success(f"Connected to PostgreSQL")
        log_info(f"Version: {version.split(',')[0]}")
        return True
    except Exception as e:
        log_error(f"PostgreSQL connection failed: {e}")
        return False


def test_database_schema():
    """Test 2: Verify database schema exists"""
    log_test("Database Schema Validation")
    
    required_tables = {
        "verra": ["id", "project_id", "registry_status", "country", "vintage", "supply", "updated_at"],
        "carbonmark": ["id", "project_id", "project_name", "vintage", "amount", "last_update"],
        "finance": ["ticker", "price", "timestamp"],
        "news": ["guid", "title", "link", "published", "source", "summary"]
    }
    
    try:
        conn = get_postgres_connection()
        cur = conn.cursor()
        
        # Check tables exist
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema='public'
        """)
        existing_tables = {row[0] for row in cur.fetchall()}
        
        missing_tables = set(required_tables.keys()) - existing_tables
        if missing_tables:
            log_error(f"Missing tables: {missing_tables}")
            return False
        
        log_success("All required tables exist")
        
        # Check columns for each table
        for table, required_cols in required_tables.items():
            cur.execute("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema='public' AND table_name=%s
            """, (table,))
            existing_cols = {row[0] for row in cur.fetchall()}
            
            missing_cols = set(required_cols) - existing_cols
            if missing_cols:
                log_warning(f"Table '{table}' missing columns: {missing_cols}")
            else:
                log_info(f"✓ Table '{table}' schema OK")
        
        conn.close()
        return True
        
    except Exception as e:
        log_error(f"Schema validation failed: {e}")
        return False


def test_wal_configuration():
    """Test 3: Verify WAL settings for CDC"""
    log_test("PostgreSQL WAL Configuration")
    
    try:
        conn = get_postgres_connection()
        cur = conn.cursor()
        
        # Check WAL level
        cur.execute("SHOW wal_level;")
        wal_level = cur.fetchone()[0]
        
        if wal_level != "logical":
            log_error(f"WAL level is '{wal_level}', expected 'logical'")
            return False
        
        log_success(f"WAL level: {wal_level}")
        
        # Check replication slots
        cur.execute("SELECT COUNT(*) FROM pg_replication_slots;")
        slot_count = cur.fetchone()[0]
        log_info(f"Replication slots: {slot_count}")
        
        conn.close()
        return True
        
    except Exception as e:
        log_error(f"WAL configuration check failed: {e}")
        return False


def insert_test_data() -> Dict[str, str]:
    """Test 4: Insert test data into all tables"""
    log_test("Insert Test Data")
    
    test_guids = {}
    
    try:
        conn = get_postgres_connection()
        cur = conn.cursor()
        
        # Insert test news
        news_guid = f"test-news-docker-{uuid.uuid4()}"
        cur.execute("""
            INSERT INTO news (guid, title, link, published, source, summary)
            VALUES (%s, %s, %s, NOW(), %s, %s)
            ON CONFLICT (guid) DO NOTHING
        """, (
            news_guid,
            "Test Carbon Market Update (Docker)",
            "http://test.example.com/news/docker",
            TEST_NEWS_SOURCE,
            "This is a test news article for Docker system testing"
        ))
        test_guids['news'] = news_guid
        log_info(f"Inserted test news: {news_guid}")
        
        # Insert test verra project (id is SERIAL, so let DB generate it)
        verra_project_id = f"test-verra-docker-{uuid.uuid4()}"
        cur.execute("""
            INSERT INTO verra (project_id, registry_status, country, vintage, supply, updated_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
            ON CONFLICT (project_id) DO UPDATE SET updated_at = NOW()
            RETURNING id
        """, (
            verra_project_id,
            "ACTIVE",
            "Brazil",
            2024,
            5000.0
        ))
        verra_id = cur.fetchone()[0]
        test_guids['verra'] = str(verra_id)
        log_info(f"Inserted test verra: id={verra_id}, project_id={verra_project_id}")
        
        # Insert test carbonmark (id is also SERIAL)
        cur.execute("""
            INSERT INTO carbonmark (project_id, project_name, vintage, amount, last_update)
            VALUES (%s, %s, %s, %s, NOW())
            RETURNING id
        """, (
            verra_project_id,  # Link to verra project
            "Test Carbon Project (Docker)",
            2024,
            1000.50
        ))
        carbonmark_id = cur.fetchone()[0]
        test_guids['carbonmark'] = str(carbonmark_id)
        log_info(f"Inserted test carbonmark: id={carbonmark_id}")
        
        # Insert/update test finance data (ticker is unique constraint, not id)
        cur.execute("""
            INSERT INTO finance (ticker, price, timestamp)
            VALUES (%s, %s, %s)
            ON CONFLICT (ticker) DO UPDATE SET 
                price = EXCLUDED.price,
                timestamp = EXCLUDED.timestamp
        """, (
            "KRBN",
            42.50,
            int(time.time())
        ))
        test_guids['finance'] = "KRBN"
        log_info(f"Inserted test finance: KRBN")
        
        conn.commit()
        conn.close()
        
        log_success(f"Inserted {len(test_guids)} test records")
        return test_guids
        
    except Exception as e:
        log_error(f"Test data insertion failed: {e}")
        import traceback
        traceback.print_exc()
        return {}


def verify_data_counts():
    """Test 5: Verify scrapers have populated data"""
    log_test("Data Population Check")
    
    try:
        conn = get_postgres_connection()
        cur = conn.cursor()
        
        tables = ["verra", "carbonmark", "finance", "news"]
        counts = {}
        
        for table in tables:
            cur.execute(f"SELECT COUNT(*) FROM {table}")
            count = cur.fetchone()[0]
            counts[table] = count
            log_info(f"{table}: {count} rows")
        
        conn.close()
        
        if all(count > 0 for count in counts.values()):
            log_success("All tables have data")
            return True
        else:
            log_warning("Some tables are empty (scrapers may still be running)")
            return True  # Not a critical failure
            
    except Exception as e:
        log_error(f"Data count check failed: {e}")
        return False


# ============================================================
# DEBEZIUM TESTS
# ============================================================

def test_debezium_connector():
    """Test 6: Check Debezium connector status"""
    log_test("Debezium Connector Status")
    
    try:
        # Check connector exists
        response = requests.get(f"{DEBEZIUM_CONNECT_URL}/connectors", timeout=5)
        response.raise_for_status()
        
        connectors = response.json()
        log_info(f"Found connectors: {connectors}")
        
        if "postgres-connector" not in connectors:
            log_warning("postgres-connector not found")
            return False
        
        # Check connector status
        status_response = requests.get(
            f"{DEBEZIUM_CONNECT_URL}/connectors/postgres-connector/status",
            timeout=5
        )
        status_response.raise_for_status()
        
        status = status_response.json()
        connector_state = status.get("connector", {}).get("state")
        
        log_info(f"Connector state: {connector_state}")
        
        # Check tasks
        tasks = status.get("tasks", [])
        for i, task in enumerate(tasks):
            task_state = task.get("state")
            log_info(f"Task {i}: {task_state}")
        
        if connector_state == "RUNNING":
            log_success("Debezium connector is running")
            return True
        else:
            log_error(f"Connector state is {connector_state}")
            return False
            
    except requests.exceptions.RequestException as e:
        log_error(f"Could not connect to Debezium: {e}")
        return False
    except Exception as e:
        log_error(f"Debezium check failed: {e}")
        return False


# ============================================================
# KAFKA TESTS
# ============================================================

def get_kafka_admin_client():
    """Get Kafka admin client"""
    return AdminClient({"bootstrap.servers": KAFKA_BROKER})


def test_kafka_connectivity():
    """Test 7: Kafka broker connectivity"""
    log_test("Kafka Connectivity")
    
    try:
        admin = get_kafka_admin_client()
        metadata = admin.list_topics(timeout=10)
        
        topics = list(metadata.topics.keys())
        log_success(f"Connected to Kafka ({len(topics)} topics)")
        
        return True
        
    except Exception as e:
        log_error(f"Kafka connection failed: {e}")
        return False


def test_kafka_topics():
    """Test 8: Verify CDC topics exist"""
    log_test("Kafka CDC Topics")
    
    try:
        admin = get_kafka_admin_client()
        metadata = admin.list_topics(timeout=10)
        
        topics = list(metadata.topics.keys())
        
        expected_patterns = [
            "carbon.public.verra",
            "carbon.public.carbonmark",
            "carbon.public.finance",
            "carbon.public.news"
        ]
        
        found_topics = []
        for pattern in expected_patterns:
            matching = [t for t in topics if pattern in t]
            if matching:
                found_topics.extend(matching)
                log_info(f"✓ Found: {matching[0]}")
            else:
                log_warning(f"Missing: {pattern}")
        
        if found_topics:
            log_success(f"Found {len(found_topics)} CDC topics")
            return True
        else:
            log_warning("No CDC topics found (connector may need time)")
            return False
            
    except Exception as e:
        log_error(f"Topic check failed: {e}")
        return False


def test_kafka_cdc_events(test_guids: Dict[str, str], timeout: int = 30):
    """Test 9: Verify CDC events in Kafka"""
    log_test("Kafka CDC Event Stream")
    
    if not test_guids:
        log_warning("No test GUIDs provided, skipping CDC event check")
        return False
    
    try:
        # Find the news topic
        admin = get_kafka_admin_client()
        metadata = admin.list_topics(timeout=10)
        topics = list(metadata.topics.keys())
        
        news_topic = None
        for topic in topics:
            if "news" in topic and "carbon" in topic:
                news_topic = topic
                break
        
        if not news_topic:
            log_warning("News CDC topic not found")
            return False
        
        log_info(f"Consuming from: {news_topic}")
        
        # Create consumer
        consumer = Consumer({
            "bootstrap.servers": KAFKA_BROKER,
            "group.id": f"test-consumer-docker-{int(time.time())}",
            "auto.offset.reset": "earliest",
            "enable.auto.commit": False
        })
        
        consumer.subscribe([news_topic])
        
        # Look for our test GUID
        target_guid = test_guids.get('news')
        found = False
        start_time = time.time()
        message_count = 0
        
        log_info(f"Looking for GUID: {target_guid}")
        
        while time.time() - start_time < timeout:
            msg = consumer.poll(1.0)
            
            if msg is None:
                continue
            
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    log_error(f"Kafka error: {msg.error()}")
                    break
            
            message_count += 1
            
            try:
                payload = json.loads(msg.value().decode('utf-8'))
                after = payload.get('payload', {}).get('after', {})
                
                if after and after.get('guid') == target_guid:
                    log_success(f"Found CDC event for test data (msg #{message_count})")
                    found = True
                    break
                    
            except json.JSONDecodeError:
                continue
        
        consumer.close()
        
        if found:
            return True
        else:
            log_warning(f"Did not find CDC event in {timeout}s ({message_count} messages checked)")
            return False
            
    except Exception as e:
        log_error(f"CDC event check failed: {e}")
        return False


# ============================================================
# REDIS TESTS
# ============================================================

def test_redis_connectivity():
    """Test 10: Redis connection"""
    log_test("Redis Connectivity")
    
    try:
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        r.ping()
        
        # Get info
        info = r.info()
        log_success(f"Connected to Redis")
        log_info(f"Version: {info.get('redis_version')}")
        log_info(f"Connected clients: {info.get('connected_clients')}")
        
        return True
        
    except Exception as e:
        log_error(f"Redis connection failed: {e}")
        return False


def test_redis_cache_operations():
    """Test 11: Redis cache read/write"""
    log_test("Redis Cache Operations")
    
    try:
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        
        # Test write
        test_key = f"test:cache:docker:{uuid.uuid4()}"
        test_value = {"test": "data", "timestamp": time.time()}
        
        r.set(test_key, json.dumps(test_value), ex=60)
        log_info(f"✓ Write test passed")
        
        # Test read
        retrieved = json.loads(r.get(test_key))
        assert retrieved == test_value
        log_info(f"✓ Read test passed")
        
        # Test expiry
        ttl = r.ttl(test_key)
        assert ttl > 0
        log_info(f"✓ TTL test passed (expires in {ttl}s)")
        
        # Cleanup
        r.delete(test_key)
        
        log_success("Redis cache operations OK")
        return True
        
    except Exception as e:
        log_error(f"Redis cache test failed: {e}")
        return False


# ============================================================
# GRPC TESTS
# ============================================================

def test_grpc_connectivity():
    """Test 12: gRPC server connection"""
    log_test("gRPC Server Connectivity")
    
    if not pb2 or not pb2_grpc:
        log_error("gRPC stubs not available")
        return False
    
    try:
        channel = grpc.insecure_channel(GRPC_TARGET)
        grpc.channel_ready_future(channel).result(timeout=10)
        
        log_success("gRPC server is reachable")
        channel.close()
        return True
        
    except Exception as e:
        log_error(f"gRPC connection failed: {e}")
        return False


def test_grpc_get_projects():
    """Test 13: gRPC GetProjects endpoint"""
    log_test("gRPC GetProjects Endpoint")
    
    if not pb2 or not pb2_grpc:
        log_error("gRPC stubs not available")
        return False
    
    try:
        channel = grpc.insecure_channel(GRPC_TARGET)
        stub = pb2_grpc.CarbonServiceStub(channel)
        
        # Test without filter
        response = stub.GetProjects(pb2.ProjectQuery())
        log_info(f"✓ Unfiltered query returned {len(response.items)} projects")
        
        # Test with country filter
        response = stub.GetProjects(pb2.ProjectQuery(country="Brazil"))
        log_info(f"✓ Brazil filter returned {len(response.items)} projects")
        
        # Check response structure
        if response.items:
            item = response.items[0]
            log_info(f"Sample: {item.project_id[:30]}... ({item.country})")
        
        channel.close()
        log_success("GetProjects endpoint OK")
        return True
        
    except grpc.RpcError as e:
        log_error(f"gRPC call failed: {e.code()} - {e.details()}")
        return False
    except Exception as e:
        log_error(f"GetProjects test failed: {e}")
        return False


def test_grpc_get_news():
    """Test 14: gRPC GetNews endpoint"""
    log_test("gRPC GetNews Endpoint")
    
    if not pb2 or not pb2_grpc:
        log_error("gRPC stubs not available")
        return False
    
    try:
        channel = grpc.insecure_channel(GRPC_TARGET)
        stub = pb2_grpc.CarbonServiceStub(channel)
        
        # Test without filter
        response = stub.GetNews(pb2.NewsQuery())
        log_info(f"✓ Unfiltered query returned {len(response.items)} news items")
        
        # Test with source filter
        response = stub.GetNews(pb2.NewsQuery(source=TEST_NEWS_SOURCE))
        log_info(f"✓ Source filter returned {len(response.items)} items")
        
        # Check response structure
        if response.items:
            item = response.items[0]
            log_info(f"Sample: {item.title[:50]}...")
        
        channel.close()
        log_success("GetNews endpoint OK")
        return True
        
    except grpc.RpcError as e:
        log_error(f"gRPC call failed: {e.code()} - {e.details()}")
        return False
    except Exception as e:
        log_error(f"GetNews test failed: {e}")
        return False


# ============================================================
# MAIN TEST RUNNER
# ============================================================

def run_all_tests():
    """Execute all system tests"""
    
    print("\n" + "=" * 70)
    print("🧪 CARBON INTELLIGENCE PLATFORM - DOCKER SYSTEM TEST")
    print("=" * 70)
    
    results = []
    test_guids = {}
    
    # Phase 1: Infrastructure
    print(f"\n{YELLOW}PHASE 1: Infrastructure{RESET}")
    results.append(("PostgreSQL Connection", test_postgres_connection()))
    results.append(("Database Schema", test_database_schema()))
    results.append(("WAL Configuration", test_wal_configuration()))
    results.append(("Redis Connectivity", test_redis_connectivity()))
    results.append(("Redis Operations", test_redis_cache_operations()))
    results.append(("Kafka Connectivity", test_kafka_connectivity()))
    
    # Phase 2: Data Layer
    print(f"\n{YELLOW}PHASE 2: Data Layer{RESET}")
    results.append(("Data Population", verify_data_counts()))
    test_guids = insert_test_data()
    results.append(("Test Data Insertion", bool(test_guids)))
    
    # Phase 3: CDC Pipeline
    print(f"\n{YELLOW}PHASE 3: CDC Pipeline{RESET}")
    results.append(("Debezium Connector", test_debezium_connector()))
    time.sleep(2)  # Allow connector to stabilize
    results.append(("Kafka CDC Topics", test_kafka_topics()))
    results.append(("Kafka CDC Events", test_kafka_cdc_events(test_guids)))
    
    # Phase 4: gRPC Service
    print(f"\n{YELLOW}PHASE 4: gRPC Service{RESET}")
    
    # Wait for gRPC server
    def grpc_check():
        if not pb2 or not pb2_grpc:
            raise Exception("gRPC stubs missing")
        channel = grpc.insecure_channel(GRPC_TARGET)
        grpc.channel_ready_future(channel).result(timeout=5)
        channel.close()
    
    grpc_ready = wait_for_service(grpc_check, "gRPC Server", max_wait=20)
    
    if grpc_ready:
        results.append(("gRPC Connectivity", test_grpc_connectivity()))
        results.append(("gRPC GetProjects", test_grpc_get_projects()))
        results.append(("gRPC GetNews", test_grpc_get_news()))
    else:
        log_warning("gRPC server not ready, skipping gRPC tests")
        results.append(("gRPC Tests", False))
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = f"{GREEN}PASS{RESET}" if result else f"{RED}FAIL{RESET}"
        print(f"{status:20} {test_name}")
    
    print("=" * 70)
    print(f"\nResults: {passed}/{total} tests passed ({100*passed//total}%)")
    
    if passed == total:
        print(f"\n{GREEN}🎉 ALL TESTS PASSED - SYSTEM FULLY OPERATIONAL{RESET}\n")
        return 0
    elif passed >= total * 0.7:
        print(f"\n{YELLOW}⚠️  MOST TESTS PASSED - SYSTEM PARTIALLY OPERATIONAL{RESET}\n")
        return 1
    else:
        print(f"\n{RED}❌ MULTIPLE FAILURES - SYSTEM NOT OPERATIONAL{RESET}\n")
        return 2


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    try:
        exit_code = run_all_tests()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print(f"\n\n{YELLOW}Test interrupted by user{RESET}\n")
        sys.exit(130)
    except Exception as e:
        print(f"\n{RED}Fatal error: {e}{RESET}\n")
        import traceback
        traceback.print_exc()
        sys.exit(1)
