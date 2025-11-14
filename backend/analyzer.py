import io
import socket
import ssl
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

import pycurl
import requests
import tldextract
from bs4 import BeautifulSoup
from fpdf import FPDF

# Try to import optional libraries
try:
    import pycurl

    has_pycurl = True
except ImportError:
    has_pycurl = False

try:
    import dns.resolver

    has_dnspython = True
except ImportError:
    has_dnspython = False

# -----------------------
# New Feature Functions
# -----------------------


def detect_http_version(response):
    """Detect HTTP protocol version"""
    try:
        version_map = {10: "HTTP/1.0", 11: "HTTP/1.1", 20: "HTTP/2.0"}
        if hasattr(response, "raw") and hasattr(response.raw, "version"):
            return version_map.get(response.raw.version, "Unknown")
    except:
        pass
    return "HTTP/1.1"  # Default assumption


def detect_cdn(headers, hostname):
    """Detect CDN provider from headers and hostname"""
    headers_lower = {k.lower(): v for k, v in headers.items()}

    # Header-based detection
    cdn_indicators = {
        "cf-ray": "Cloudflare",
        "x-amz-cf-id": "AWS CloudFront",
        "x-cache": "Fastly/Varnish",
        "x-akamai-transformed": "Akamai",
        "x-cdn": "Generic CDN",
        "via": "Proxy/CDN",
    }

    for header, cdn in cdn_indicators.items():
        if header in headers_lower:
            if header == "via" and "cloudflare" in headers_lower[header].lower():
                return "Cloudflare"
            elif header == "x-cache":
                if "cloudfront" in headers_lower[header].lower():
                    return "AWS CloudFront"
                return cdn
            return cdn

    # Server header detection
    server = headers_lower.get("server", "").lower()
    if "cloudflare" in server:
        return "Cloudflare"
    elif "akamai" in server:
        return "Akamai"

    return "None detected"


def check_compression(url):
    """Check compression type and effectiveness"""
    try:
        headers = {"Accept-Encoding": "gzip, deflate, br"}
        resp = requests.get(url, headers=headers, timeout=10, stream=True)
        encoding = resp.headers.get("Content-Encoding", "none")
        return encoding if encoding != "none" else "None"
    except Exception as e:
        return "Unknown"


def advanced_dns_lookup(hostname):
    """Perform DNS lookup with multiple resolvers"""
    if not has_dnspython:
        return None

    resolvers = {
        "8.8.8.8": "Google DNS",
        "1.1.1.1": "Cloudflare DNS",
        "208.67.222.222": "OpenDNS",
    }
    results = {}

    for dns_server, name in resolvers.items():
        resolver = dns.resolver.Resolver()
        resolver.nameservers = [dns_server]
        resolver.timeout = 5
        resolver.lifetime = 5
        start = time.time()
        try:
            resolver.resolve(hostname, "A")
            results[name] = round((time.time() - start) * 1000, 2)
        except:
            results[name] = None

    return results


def security_headers_score(headers):
    """Calculate security headers score"""
    headers_lower = {k.lower(): v for k, v in headers.items()}

    security_checks = {
        "strict-transport-security": 20,
        "content-security-policy": 20,
        "x-frame-options": 15,
        "x-content-type-options": 15,
        "referrer-policy": 10,
        "permissions-policy": 10,
        "x-xss-protection": 10,
    }

    score = 0
    present = {}
    missing = []

    for header, points in security_checks.items():
        if header in headers_lower:
            score += points
            present[header] = headers_lower[header][:50]  # Truncate long values
        else:
            missing.append(header)

    return {"score": score, "present": present, "missing": missing}


def check_connection_reuse(url):
    """Check if connection reuse is working (Keep-Alive)"""
    try:
        session = requests.Session()
        times = []
        for i in range(3):
            start = time.time()
            session.get(url, timeout=10)
            times.append((time.time() - start) * 1000)

        benefit = round(times[0] - sum(times[1:]) / 2, 2)
        return {
            "first_request": round(times[0], 2),
            "subsequent_avg": round(sum(times[1:]) / 2, 2),
            "benefit": benefit if benefit > 0 else 0,
        }
    except:
        return None


def get_server_location(ip):
    """Get geographic location of server"""
    try:
        resp = requests.get(f"http://ip-api.com/json/{ip}", timeout=5)
        data = resp.json()
        if data.get("status") == "success":
            return f"{data.get('city', 'Unknown')}, {data.get('country', 'Unknown')}"
    except:
        pass
    return "Unknown"


# -----------------------
# Original Functions (Enhanced)
# -----------------------


def check_ssl_security(hostname, port=443, timeout=10):
    """Check SSL/TLS certificate details and calculate a security score"""
    result = {
        "ssl_valid": 0,
        "ssl_days_remaining": None,
        "ssl_issuer": None,
        "ssl_version": None,
        "ssl_cipher": None,
        "ssl_score": 0,
        "ssl_score_breakdown": {},
    }

    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, port), timeout=timeout) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                cipher = ssock.cipher()
                version = ssock.version()

                if cert:
                    not_after = cert.get("notAfter")
                    if not_after:
                        expiry_date = datetime.strptime(
                            not_after, "%b %d %H:%M:%S %Y %Z"
                        )
                        days_remaining = (expiry_date - datetime.now()).days
                        result["ssl_days_remaining"] = days_remaining
                        result["ssl_valid"] = 1 if days_remaining > 0 else 0

                    issuer = cert.get("issuer")
                    if issuer:
                        issuer_cn = dict(x[0] for x in issuer).get(
                            "commonName", "Unknown"
                        )
                        result["ssl_issuer"] = issuer_cn[:50]

                result["ssl_version"] = version
                if cipher:
                    result["ssl_cipher"] = cipher[0][:50]

                score = 0
                breakdown = {}

                if result["ssl_valid"] == 1:
                    score += 40
                    breakdown["Valid Certificate"] = 40
                else:
                    breakdown["Valid Certificate"] = 0

                if result["ssl_days_remaining"]:
                    if result["ssl_days_remaining"] > 90:
                        score += 30
                        breakdown["Certificate Expiry (>90 days)"] = 30
                    elif result["ssl_days_remaining"] > 30:
                        score += 20
                        breakdown["Certificate Expiry (30-90 days)"] = 20
                    elif result["ssl_days_remaining"] > 0:
                        score += 10
                        breakdown["Certificate Expiry (<30 days)"] = 10
                    else:
                        breakdown["Certificate Expiry (Expired)"] = 0
                else:
                    breakdown["Certificate Expiry"] = 0

                if version:
                    if version in ["TLSv1.3"]:
                        score += 20
                        breakdown["TLS Version (1.3)"] = 20
                    elif version in ["TLSv1.2"]:
                        score += 15
                        breakdown["TLS Version (1.2)"] = 15
                    elif version in ["TLSv1.1"]:
                        score += 5
                        breakdown["TLS Version (1.1)"] = 5
                    else:
                        breakdown[f"TLS Version ({version})"] = 0
                else:
                    breakdown["TLS Version"] = 0

                if cipher and cipher[0]:
                    cipher_name = cipher[0].upper()
                    if (
                        "AES_256" in cipher_name
                        or "AES256" in cipher_name
                        or "CHACHA20" in cipher_name
                    ):
                        score += 10
                        breakdown["Cipher Strength (Strong)"] = 10
                    elif "AES_128" in cipher_name or "AES128" in cipher_name:
                        score += 7
                        breakdown["Cipher Strength (Good)"] = 7
                    elif "AES" in cipher_name:
                        score += 5
                        breakdown["Cipher Strength (Moderate)"] = 5
                    else:
                        breakdown["Cipher Strength (Weak)"] = 0
                else:
                    breakdown["Cipher Strength"] = 0

                result["ssl_score"] = min(score, 100)
                result["ssl_score_breakdown"] = breakdown

    except Exception as e:
        result["ssl_score"] = 0
        result["ssl_valid"] = 0
        result["ssl_score_breakdown"] = {"Error": "SSL check failed"}

    return result


def measure_dns(hostname, timeout=5.0):
    start = time.time()
    try:
        socket.setdefaulttimeout(timeout)
        socket.getaddrinfo(hostname, None)
        dns_ms = (time.time() - start) * 1000
        try:
            ip = socket.gethostbyname(hostname)
        except Exception:
            ip = None
    except Exception:
        dns_ms = None
        ip = None
    return dns_ms, ip


def measure_with_pycurl(url, timeout=30):
    buffer = io.BytesIO()
    c = pycurl.Curl()
    c.setopt(pycurl.URL, url)
    c.setopt(pycurl.WRITEDATA, buffer)
    c.setopt(pycurl.NOPROGRESS, True)
    c.setopt(pycurl.FOLLOWLOCATION, True)
    c.setopt(pycurl.CONNECTTIMEOUT, int(timeout))
    c.setopt(pycurl.TIMEOUT, int(timeout))
    try:
        c.perform()
    except pycurl.error:
        c.close()
        return None
    connect_time = c.getinfo(pycurl.CONNECT_TIME) * 1000
    appconnect_time = c.getinfo(pycurl.APPCONNECT_TIME) * 1000
    starttransfer_time = c.getinfo(pycurl.STARTTRANSFER_TIME) * 1000
    total_time = c.getinfo(pycurl.TOTAL_TIME) * 1000
    http_code = c.getinfo(pycurl.RESPONSE_CODE)
    size_download = c.getinfo(pycurl.SIZE_DOWNLOAD) / 1024
    c.close()
    return {
        "tcp": round(connect_time, 2),
        "ssl": round(appconnect_time, 2),
        "ttfb": round(starttransfer_time, 2),
        "total": round(total_time, 2),
        "status_code": http_code,
        "size_kb": round(size_download, 2),
    }


def measure_with_requests(url, timeout=30):
    try:
        session = requests.Session()
        start = time.time()
        resp = session.get(url, timeout=timeout, stream=True)
        ttfb = (time.time() - start) * 1000
        content = resp.content
        total_time = (time.time() - start) * 1000
        size_kb = len(content) / 1024
        return {
            "tcp": None,
            "ssl": None,
            "ttfb": round(ttfb, 2),
            "total": round(total_time, 2),
            "status_code": resp.status_code,
            "size_kb": round(size_kb, 2),
        }
    except Exception as e:
        return None


def resource_breakdown(base_url, html_text, timeout=5, max_resources=30):
    """Parse HTML, find images/scripts/css and try HEAD to get sizes"""
    soup = BeautifulSoup(html_text, "html.parser")

    imgs = [img.get("src") for img in soup.find_all("img") if img.get("src")]
    scripts = [s.get("src") for s in soup.find_all("script") if s.get("src")]
    links = [
        l.get("href")
        for l in soup.find_all("link", rel=lambda x: x and "stylesheet" in x)
    ]

    totals = {"images_kb": 0.0, "scripts_kb": 0.0, "css_kb": 0.0}

    def get_size(rurl):
        try:
            head = requests.head(rurl, timeout=timeout, allow_redirects=True)
            if head.status_code >= 400:
                get = requests.get(rurl, timeout=timeout, stream=True)
                data = get.content
                return len(data) / 1024
            cl = head.headers.get("Content-Length")
            if cl:
                return int(cl) / 1024
            else:
                g = requests.get(rurl, timeout=timeout, stream=True)
                return len(g.content) / 1024
        except Exception:
            return 0.0

    img_urls = imgs[:max_resources]
    script_urls = scripts[:max_resources]
    css_urls = links[:max_resources]

    def make_absolute(u):
        try:
            return requests.compat.urljoin(base_url, u)
        except:
            return u

    with ThreadPoolExecutor(max_workers=8) as ex:
        futures = {}
        for u in img_urls:
            futures[ex.submit(get_size, make_absolute(u))] = ("img", u)
        for u in script_urls:
            futures[ex.submit(get_size, make_absolute(u))] = ("script", u)
        for u in css_urls:
            futures[ex.submit(get_size, make_absolute(u))] = ("css", u)

        for fut in as_completed(futures):
            kind, url = futures[fut]
            size = 0.0
            try:
                size = fut.result()
            except Exception:
                size = 0.0
            if kind == "img":
                totals["images_kb"] += size
            elif kind == "script":
                totals["scripts_kb"] += size
            elif kind == "css":
                totals["css_kb"] += size

    for k in totals:
        totals[k] = round(totals[k], 2)
    return totals


# -----------------------
# High-level analyze function (Enhanced)
# -----------------------
def analyze_site(url, fetch_resources=True, resource_limit=20, check_advanced=True):
    out = {
        "url": url,
        "ip": None,
        "dns": None,
        "tcp": None,
        "ssl": None,
        "ttfb": None,
        "total": None,
        "size_kb": None,
        "status_code": None,
        "images_kb": None,
        "scripts_kb": None,
        "css_kb": None,
        "ssl_score": None,
        "ssl_valid": None,
        "ssl_days_remaining": None,
        "ssl_issuer": None,
        "ssl_version": None,
        "ssl_cipher": None,
        "ssl_score_breakdown": None,
        "http_version": None,
        "cdn_provider": None,
        "compression_type": None,
        "security_headers_score": None,
        "security_headers_present": None,
        "security_headers_missing": None,
        "server_location": None,
        "connection_reuse_benefit": None,
        "dns_breakdown": None,
    }

    if not url.startswith("http"):
        url = "http://" + url
    out["url"] = url

    hostname = tldextract.extract(url)
    hostname = ".".join(part for part in [hostname.domain, hostname.suffix] if part)

    # DNS
    dns_ms, ip = measure_dns(hostname)
    out["dns"] = round(dns_ms, 2) if dns_ms else None
    out["ip"] = ip

    # Advanced DNS lookup
    if check_advanced and has_dnspython:
        out["dns_breakdown"] = advanced_dns_lookup(hostname)

    # SSL Security Check
    if url.startswith("https://"):
        try:
            ssl_info = check_ssl_security(hostname)
            out.update(ssl_info)
        except Exception:
            pass

    # Main request with enhanced detection
    response = None
    pyinfo = None
    if has_pycurl:
        try:
            pyinfo = measure_with_pycurl(url)
        except Exception:
            pyinfo = None

    if pyinfo:
        out["tcp"] = pyinfo.get("tcp")
        out["ssl"] = pyinfo.get("ssl")
        out["ttfb"] = pyinfo.get("ttfb")
        out["total"] = pyinfo.get("total")
        out["status_code"] = pyinfo.get("status_code")
        out["size_kb"] = pyinfo.get("size_kb")
        try:
            response = requests.get(url, timeout=20)
        except Exception:
            response = None
    else:
        rinfo = measure_with_requests(url)
        if rinfo:
            out["ttfb"] = rinfo.get("ttfb")
            out["total"] = rinfo.get("total")
            out["status_code"] = rinfo.get("status_code")
            out["size_kb"] = rinfo.get("size_kb")
            try:
                response = requests.get(url, timeout=20)
            except Exception:
                response = None

    # Enhanced features
    if response:
        if check_advanced:
            out["http_version"] = detect_http_version(response)
            out["cdn_provider"] = detect_cdn(response.headers, hostname)
            out["compression_type"] = check_compression(url)

            sec_headers = security_headers_score(response.headers)
            out["security_headers_score"] = sec_headers["score"]
            out["security_headers_present"] = sec_headers["present"]
            out["security_headers_missing"] = sec_headers["missing"]

            if ip:
                out["server_location"] = get_server_location(ip)

            conn_reuse = check_connection_reuse(url)
            if conn_reuse:
                out["connection_reuse_benefit"] = conn_reuse["benefit"]

        # Resource breakdown
        if fetch_resources:
            try:
                breakdown = resource_breakdown(
                    url, response.text, max_resources=resource_limit
                )
                out.update(breakdown)
            except Exception:
                pass

    # Ensure SSL score is set
    if out.get("ssl_score") is None:
        out["ssl_score"] = 0

    return out


# -----------------------
# PDF Export
# -----------------------
def export_pdf(records, filename="report.pdf"):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Website Performance Analyzer Report", ln=True, align="C")
    pdf.ln(5)

    for r in records:
        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 6, f"URL: {r.get('url')}", ln=True)
        pdf.set_font("Arial", size=9)
        pdf.cell(
            0,
            5,
            f"IP: {r.get('ip')}   Status: {r.get('status_code')}   Location: {r.get('server_location', 'N/A')}",
            ln=True,
        )
        pdf.cell(
            0,
            5,
            f"DNS: {r.get('dns')} ms, TCP: {r.get('tcp')} ms, SSL: {r.get('ssl')} ms",
            ln=True,
        )
        pdf.cell(
            0,
            5,
            f"TTFB: {r.get('ttfb')} ms, Total: {r.get('total')} ms, Size: {r.get('size_kb')} KB",
            ln=True,
        )
        pdf.cell(
            0,
            5,
            f"HTTP: {r.get('http_version', 'N/A')}, CDN: {r.get('cdn_provider', 'N/A')}, Compression: {r.get('compression_type', 'N/A')}",
            ln=True,
        )
        pdf.cell(
            0,
            5,
            f"SSL Score: {r.get('ssl_score')}/100, Security Headers: {r.get('security_headers_score', 0)}/100",
            ln=True,
        )
        pdf.ln(4)

    pdf.output(filename)
    return filename
