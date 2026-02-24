import os

# Search defaults
DEFAULT_CITY = "CHENNAI"
DEFAULT_PINCODE = "603203"
REQUEST_TIMEOUT = 15
MAX_AGGREGATOR_WAIT_SECONDS = 5.0

# CORS
_raw_origins = os.getenv("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS: list[str] = (
    [o.strip() for o in _raw_origins.split(",") if o.strip()]
    if _raw_origins
    else [
        "https://medgency.vercel.app",   # no trailing slash
        "https://doze.medgency.in",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
)