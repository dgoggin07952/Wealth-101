"""
WealthTracker Pro - FastAPI Production Entry Point
Works with Vercel, Railway, Render, and other hosting platforms
"""

import sys
import os
from pathlib import Path

# Add backend to Python path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

# Import and expose the FastAPI app
from app.main import app

# For Vercel serverless deployment
def handler(request):
    return app(request)

# For traditional deployment
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)