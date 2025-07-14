# WealthTracker Pro - Production Deployment Guide

## Current Status
- ✅ FastAPI backend running on port 5000
- ✅ React frontend served correctly  
- ✅ All API endpoints functional
- ✅ Database connected and operational
- ❌ Deployment configuration pointing to Streamlit

## Deployment Solutions

### Option 1: Manual .replit Edit (Recommended)
Edit `.replit` file in Replit editor, line 9:
```toml
# Change from:
run = ["streamlit", "run", "app.py", "--server.port", "5000"]

# To:
run = ["python", "main.py"]
```

### Option 2: Alternative Commands
If Option 1 doesn't work, try these in `.replit`:

```toml
run = ["python", "app.py"]
```

```toml
run = ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
```

```toml
run = ["bash", "run.sh"]
```

### Option 3: Direct FastAPI Deployment
For other hosting platforms:

```bash
# Install dependencies
pip install -r requirements.txt

# Run application
python main.py
```

## Application Architecture
- **Backend**: FastAPI with PostgreSQL database
- **Frontend**: React SPA with Tailwind CSS
- **Authentication**: JWT tokens
- **Reports**: PDF generation with ReportLab
- **Deployment**: Single FastAPI server serving both API and static files

## Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET_KEY`: For token signing (auto-generated)
- `CORS_ORIGINS`: Allowed frontend origins

## API Endpoints
- `/` - React frontend
- `/api/auth/*` - Authentication
- `/api/assets/*` - Asset management
- `/api/analytics` - Dashboard data
- `/api/milestones` - Financial goals
- `/api/reports/*` - PDF generation
- `/docs` - API documentation

## Custom Domain Deployment
See `CUSTOM_DOMAIN_DEPLOYMENT.md` for VPS, cloud, and CDN deployment options.

## Troubleshooting
1. Ensure PostgreSQL is running
2. Check all environment variables are set
3. Verify React build exists in `frontend/dist`
4. Confirm all Python dependencies installed

Your WealthTracker Pro is production-ready once deployment configuration is updated!