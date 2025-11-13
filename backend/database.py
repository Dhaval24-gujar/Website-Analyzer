import sqlite3
from typing import List, Dict

DB_PATH = "results.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
              CREATE TABLE IF NOT EXISTS runs
              (
                  id
                  INTEGER
                  PRIMARY
                  KEY
                  AUTOINCREMENT,
                  url
                  TEXT,
                  timestamp
                  DATETIME
                  DEFAULT
                  CURRENT_TIMESTAMP,
                  ip
                  TEXT,
                  dns_ms
                  REAL,
                  tcp_ms
                  REAL,
                  ssl_ms
                  REAL,
                  ttfb_ms
                  REAL,
                  total_ms
                  REAL,
                  size_kb
                  REAL,
                  status_code
                  INTEGER,
                  images_kb
                  REAL,
                  scripts_kb
                  REAL,
                  css_kb
                  REAL,
                  ssl_score
                  INTEGER,
                  ssl_valid
                  INTEGER,
                  ssl_days_remaining
                  INTEGER,
                  ssl_issuer
                  TEXT,
                  ssl_version
                  TEXT,
                  ssl_cipher
                  TEXT,
                  http_version
                  TEXT,
                  cdn_provider
                  TEXT,
                  compression_type
                  TEXT,
                  security_headers_score
                  INTEGER,
                  server_location
                  TEXT,
                  connection_reuse_benefit
                  REAL
              )
              """)
    conn.commit()
    conn.close()

def save_result(record: Dict):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
              INSERT INTO runs (url, ip, dns_ms, tcp_ms, ssl_ms, ttfb_ms, total_ms, size_kb, status_code,
                                images_kb, scripts_kb, css_kb, ssl_score, ssl_valid, ssl_days_remaining,
                                ssl_issuer, ssl_version, ssl_cipher, http_version, cdn_provider,
                                compression_type, security_headers_score, server_location, connection_reuse_benefit)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              """, (
                  record.get("url"),
                  record.get("ip"),
                  record.get("dns"),
                  record.get("tcp"),
                  record.get("ssl"),
                  record.get("ttfb"),
                  record.get("total"),
                  record.get("size_kb"),
                  record.get("status_code"),
                  record.get("images_kb"),
                  record.get("scripts_kb"),
                  record.get("css_kb"),
                  record.get("ssl_score"),
                  record.get("ssl_valid"),
                  record.get("ssl_days_remaining"),
                  record.get("ssl_issuer"),
                  record.get("ssl_version"),
                  record.get("ssl_cipher"),
                  record.get("http_version"),
                  record.get("cdn_provider"),
                  record.get("compression_type"),
                  record.get("security_headers_score"),
                  record.get("server_location"),
                  record.get("connection_reuse_benefit"),
              ))
    conn.commit()
    conn.close()

def get_all_results(limit: int = 100) -> List[Dict]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM runs ORDER BY timestamp DESC LIMIT ?", (limit,))
    results = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return results

def clear_history():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM runs")
    conn.commit()
    conn.close()