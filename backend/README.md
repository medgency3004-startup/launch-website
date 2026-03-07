# Medicine Price Aggregator Backend

A FastAPI-based backend that aggregates and compares medicine prices across multiple online pharmacies in real-time.

## Features

- **Multi-Provider Search**: Concurrently fetches medicine data from:
  - Apollo Pharmacy
  - Medkart
  - Netmeds (using Playwright for browser automation)
  - 1mg (Tata 1mg)
  - PharmEasy
  - Truemeds
- **Smart Ranking**: Filters out irrelevant results and identifies the cheapest options per provider.
- **Concurrent Execution**: Uses thread pools to minimize latency when querying multiple sources.
- **Modern Tech Stack**: Built with FastAPI, Pydantic, and Playwright.

## Project Structure

```text
backend/
├── app/
│   ├── api/            # API route definitions
│   ├── models/         # Database/Internal data models
│   ├── providers/      # Provider-specific scraping/API logic
│   ├── schemas/        # Pydantic models for request/response validation
│   ├── services/       # Core business logic (aggregation, ranking)
│   ├── utils/          # Shared utility functions
│   ├── config.py       # Configuration and environment settings
│   └── main.py         # Application entry point
├── requirements.txt    # Python dependencies
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.9+
- Virtual environment (recommended)

### Installation

1. **Clone the repository and navigate to the backend directory**:

   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Install Playwright browsers**:
   (Required for Netmeds support)

   ```bash
   playwright install chromium
   ```

## Running the Application

To start the development server with auto-reload:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
You can access the interactive API documentation at `http://localhost:8000/docs`.

## API Endpoints

### Search Medicine

- **URL**: `/api/search`
- **Method**: `GET`
- **Query Parameters**:
  - `name` (string, required): The name of the medicine to search for.
- **Description**: Returns a list of matching medicines from all providers, ranked by relevance and price.

### Health Check

- **URL**: `/`
- **Method**: `GET`
- **Description**: Returns the API status.

## Environment Variables

The application can be configured using environment variables:

- `ALLOWED_ORIGINS`: A comma-separated list of origins allowed for CORS (defaults to all if not set).
