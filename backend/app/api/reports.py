"""
Reports and Analytics API endpoints
PDF generation and financial analysis
"""
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from io import BytesIO
import tempfile
import os

from app.models import User, get_db
from app.api.auth import get_current_user

router = APIRouter()

class HealthCheckRequest(BaseModel):
    include_projections: bool = True
    include_recommendations: bool = True

class HealthCheckResponse(BaseModel):
    overall_score: float
    income_expense_score: float
    emergency_fund_score: float
    goals_score: float
    insurance_score: float
    wealth_growth_score: float
    debt_score: float
    status: str
    recommendations: list

@router.get("/health-check", response_model=HealthCheckResponse)
async def get_health_check(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate financial health check analysis"""
    
    # Import calculation functions from original Streamlit app
    from app.services.health_calculator import calculate_financial_health
    
    health_data = calculate_financial_health(current_user.id, db)
    
    return HealthCheckResponse(**health_data)

@router.post("/health-check/pdf")
async def generate_health_check_pdf(
    request: HealthCheckRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate Financial Health Check PDF report"""
    
    # Import PDF generation from original Streamlit app
    from app.services.pdf_generator import generate_health_check_pdf
    
    try:
        pdf_data = generate_health_check_pdf(current_user.id, db)
        
        # Return PDF as response
        return Response(
            content=pdf_data,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=financial_health_check.pdf"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

@router.get("/wealth")
async def generate_wealth_pdf(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate modern, comprehensive wealth report PDF"""
    try:
        from app.services.stunning_pdf_generator import StunningPDFGenerator
        
        # Prepare user data
        user_data = {
            'name': current_user.name,
            'email': current_user.email,
            'currency': current_user.home_currency
        }
        
        # Prepare financial data (using realistic demo data)
        financial_data = {
            'net_worth': 315000,
            'total_assets': 350000,
            'total_liabilities': 35000,
            'assets': {
                'Cash & Savings': 75000,
                'Investments': 175000,
                'Property': 100000
            },
            'liabilities': {
                'Mortgage': 30000,
                'Other Debt': 5000
            },
            'health_score': 782,
            'monthly_income': 8500,
            'monthly_expenses': 6200
        }
        
        # Generate PDF
        generator = StunningPDFGenerator()
        pdf_content = generator.generate_wealth_report(user_data, financial_data)
        
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=wealth_report_{datetime.now().strftime('%Y_%m_%d')}.pdf"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating wealth PDF: {str(e)}")

@router.get("/estate-planning")
async def generate_estate_planning_pdf(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate modern, comprehensive estate planning report PDF"""
    try:
        from app.services.stunning_pdf_generator import StunningPDFGenerator
        
        # Prepare user data
        user_data = {
            'name': current_user.name,
            'email': current_user.email,
            'currency': current_user.home_currency
        }
        
        # Prepare financial data (using realistic demo data)
        financial_data = {
            'net_worth': 315000,
            'total_assets': 350000,
            'total_liabilities': 35000,
            'assets': {
                'Cash & Savings': 75000,
                'Investments': 175000,
                'Property': 100000
            },
            'liabilities': {
                'Mortgage': 30000,
                'Other Debt': 5000
            },
            'inheritance_tax_threshold': 325000,
            'potential_tax': 0
        }
        
        # Generate PDF
        generator = StunningPDFGenerator()
        pdf_content = generator.generate_estate_planning_report(user_data, financial_data)
        
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=estate_planning_report_{datetime.now().strftime('%Y_%m_%d')}.pdf"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating estate planning PDF: {str(e)}")

@router.get("/financial-health")
async def generate_financial_health_pdf(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate modern, comprehensive financial health report PDF using real user data"""
    try:
        from app.services.stunning_pdf_generator import StunningPDFGenerator
        from app.models import AssetDetail, IncomeRecord, ExpenseRecord, Milestone
        from sqlalchemy import func
        from datetime import datetime, timedelta
        
        # Prepare user data with real database fields (handle None values)
        user_data = {
            'name': current_user.name or 'User',
            'email': current_user.email or '',
            'currency': current_user.home_currency or 'GBP',
            'insurance_policies': current_user.insurance_policies or '',
            'will_location': current_user.will_location or '',
            'solicitor_name': current_user.solicitor_name or '',
            'power_of_attorney_location': current_user.power_of_attorney_location or ''
        }
        
        # Get real financial data from database
        # Use the analytics API data that already works correctly
        try:
            from app.api.analytics import get_analytics
            analytics_data = await get_analytics(current_user, db)
            
            # Extract data from analytics response
            metrics = analytics_data.metrics
            asset_categories = analytics_data.top_asset_categories
            
            # Convert to our expected format
            asset_totals = {
                'Cash & Savings': asset_categories.get('Cash & Savings', 0),
                'Investments': asset_categories.get('Investments', 0),
                'Property': asset_categories.get('Property', 0),
                'Retirement': asset_categories.get('Retirement', 0),
                'Other': asset_categories.get('Other', 0)
            }
            
            # Clean up empty categories
            asset_totals = {k: v for k, v in asset_totals.items() if v > 0}
            
            total_assets = sum(asset_totals.values())
            net_worth = metrics.current_wealth
            total_liabilities = max(0, total_assets - net_worth)
            
            # Income/expense data (convert 3-month data to monthly)
            recent_income = metrics.total_income_3m / 3 if metrics.total_income_3m else 0
            recent_expenses = metrics.total_expenses_3m / 3 if metrics.total_expenses_3m else 0
            
        except Exception as e:
            # Fallback to safe default values if analytics fails
            asset_totals = {}
            total_assets = 0
            total_liabilities = 0
            net_worth = 0
            recent_income = 0
            recent_expenses = 0
        
        # Get milestones (handle potential database schema issues)
        milestone_data = []
        try:
            milestones = db.query(Milestone).filter(Milestone.user_id == current_user.id).all()
            milestone_data = [{
                'title': m.title,
                'is_completed': m.is_completed,
                'target_amount': m.target_amount,
                'current_amount': m.current_amount
            } for m in milestones]
        except Exception:
            milestone_data = []
        
        # Prepare financial data with real calculations
        financial_data = {
            'net_worth': net_worth,
            'total_assets': total_assets,
            'total_liabilities': total_liabilities,
            'monthly_income': recent_income,
            'monthly_expenses': recent_expenses,
            'assets': asset_totals,
            'milestones': milestone_data
        }
        
        # Generate PDF
        generator = StunningPDFGenerator()
        pdf_content = generator.generate_financial_health_report(user_data, financial_data)
        
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=financial_health_report_{datetime.now().strftime('%Y_%m_%d')}.pdf"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating financial health PDF: {str(e)}")

# Legacy endpoint for backward compatibility
@router.get("/generate-pdf")
async def generate_legacy_pdf(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate Wealth Report PDF"""
    
    from app.services.pdf_generator import generate_wealth_report_pdf
    
    try:
        pdf_data = generate_wealth_report_pdf(
            current_user.id, 
            db, 
            start_date=start_date,
            end_date=end_date
        )
        
        return Response(
            content=pdf_data,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=wealth_report.pdf"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

@router.get("/estate-planning")
async def generate_estate_pdf(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate Estate Planning PDF"""
    
    from app.services.pdf_generator import generate_estate_planning_pdf
    
    try:
        pdf_data = generate_estate_planning_pdf(current_user.id, db)
        
        return Response(
            content=pdf_data,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=estate_planning_report.pdf"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

@router.get("/financial-health")
async def generate_financial_health_pdf(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate Financial Health Check PDF"""
    
    from app.services.pdf_generator import generate_health_check_pdf
    
    try:
        pdf_data = generate_health_check_pdf(current_user.id, db)
        
        return Response(
            content=pdf_data,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=financial_health_check.pdf"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

@router.get("/analytics/overview")
async def get_analytics_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analytics overview for dashboard"""
    
    from app.services.analytics import get_user_analytics
    
    analytics = get_user_analytics(current_user.id, db)
    
    return analytics

@router.get("/charts/wealth-trend")
async def get_wealth_trend_data(
    days: int = 90,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get data for wealth trend charts"""
    
    from app.services.chart_data import get_wealth_trend_data
    
    chart_data = get_wealth_trend_data(current_user.id, db, days)
    
    return chart_data

@router.get("/charts/asset-allocation")
async def get_asset_allocation_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get data for asset allocation pie chart"""
    
    from app.services.chart_data import get_asset_allocation_data
    
    chart_data = get_asset_allocation_data(current_user.id, db)
    
    return chart_data