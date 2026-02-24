from app.config import REQUEST_TIMEOUT

TIMEOUT = REQUEST_TIMEOUT

BROWSER_HEADERS = {
    "user-agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "accept": "application/json",
}

APOLLO_HEADERS = {
    **BROWSER_HEADERS,
    "content-type": "application/json",
    "origin": "https://www.apollopharmacy.in",
    "referer": "https://www.apollopharmacy.in/",
    "x-app-os": "web",
    "authorization": "Oeu324WMvfKOj5KMJh2Lkf00eW1",
}

ONE_MG_HEADERS = {
    **BROWSER_HEADERS,
    "accept": "application/vnd.healthkartplus.v4+json",
    "x-platform": "mobileweb-0.0.1",
    "x-1mglabs-platform": "mWeb",
    "referer": "https://www.1mg.com/",
}

TRUEMEDS_HEADERS = {
    **BROWSER_HEADERS,
    "user-agent": (
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) "
        "AppleWebKit/605.1.15 (KHTML, like Gecko) "
        "Version/18.5 Mobile Safari/605.1.15"
    ),
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    "origin": "https://www.truemeds.in",
    "referer": "https://www.truemeds.in/",
    "sec-fetch-site": "cross-site",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
}

NETMEDS_HEADERS = {
    **BROWSER_HEADERS,
    "user-agent": (
        "Mozilla/5.0 (Linux; Android 13; Pixel 7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Mobile Safari/537.36"
    ),
    "content-type": "application/json",
    "origin": "https://www.netmeds.com",
    "referer": "https://www.netmeds.com/",
    "x-currency-code": "INR",
}

PHARMEASY_HEADERS = {
    **APOLLO_HEADERS,
    "origin": "https://pharmeasy.in",
    "referer": "https://pharmeasy.in/",
}