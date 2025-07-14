"""
FastAPI Backend for WealthTracker Pro
Modern API backend with authentication, wealth management, and reporting
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os
from pathlib import Path
from dotenv import load_dotenv
from app.middleware.security import SecurityMiddleware

# Load environment variables
load_dotenv()

# Import API routers
from app.api import auth, wealth, reports, users, assets, analytics, income, expenses, milestones, profile, gamification, admin, services, whitelabel, insurance

# Security
security = HTTPBearer()

# Create FastAPI app
app = FastAPI(
    title="WealthTracker Pro API",
    description="Comprehensive wealth management backend API",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware for frontend integration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,https://your-domain.com").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Restrict to specific domains
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Add security middleware
app.add_middleware(SecurityMiddleware, calls_per_minute=100)

# Include API routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(wealth.router, prefix="/api/wealth", tags=["Wealth Management"])
app.include_router(assets.router, prefix="/api/assets", tags=["Asset Management"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(income.router, prefix="/api/income", tags=["Income Management"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expense Management"])
app.include_router(insurance.router, prefix="/api/insurance", tags=["Insurance Management"])
app.include_router(milestones.router, prefix="/api/milestones", tags=["Financial Goals"])
app.include_router(profile.router, prefix="/api/profile", tags=["User Profile"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports & Analytics"])
app.include_router(users.router, prefix="/api/users", tags=["User Management"])
app.include_router(gamification.router, prefix="/api", tags=["Gamification"])
app.include_router(admin.router, prefix="/api", tags=["Admin Dashboard"])
app.include_router(services.router, prefix="/api", tags=["Additional Services"])
app.include_router(whitelabel.router, prefix="/api", tags=["White Label Partners"])

# Serve React frontend from backend (Replit compatibility)
frontend_dist = Path(__file__).parent.parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    # Mount static assets
    app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="static")
    
    # Serve React app for non-API routes
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str = ""):
        """Serve React frontend for all non-API routes"""
        # Don't interfere with API routes
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        
        # Serve index.html for all other routes (React Router will handle routing)
        index_file = frontend_dist / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
        
        # Fallback if React build doesn't exist
        return {"error": "Frontend not built. Run 'npm run build' in frontend directory."}
else:
    @app.get("/")
    async def root():
        """Health check endpoint when React frontend not available"""
        return {
            "message": "WealthTracker Pro API",
            "version": "2.0.0",
            "status": "operational",
            "note": "React frontend not found. Access React dev server on port 5000."
        }

@app.get("/api/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "api_version": "2.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True
    )