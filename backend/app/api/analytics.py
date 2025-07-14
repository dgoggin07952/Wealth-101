"""
Analytics API endpoints for dashboard insights
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime, date, timedelta

from app.models import User, get_db
from app.api.auth import get_current_user

router = APIRouter()

class WealthTrendData(BaseModel):
    date: str
    total_wealth: float
    cash_savings: float
    stocks_securities: float
    real_estate: float
    retirement_accounts: float
    business_assets: float
    other_investments: float

class DashboardMetrics(BaseModel):
    current_wealth: float
    wealth_change_3m: float
    wealth_change_percent: float
    total_income_3m: float
    total_expenses_3m: float
    net_savings_3m: float
    emergency_fund_months: float
    
class AnalyticsResponse(BaseModel):
    metrics: DashboardMetrics
    wealth_trend: List[WealthTrendData]
    top_asset_categories: Dict[str, float]
    recent_transactions: List[Dict[str, Any]]

@router.get("", response_model=AnalyticsResponse)
async def get_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get comprehensive analytics for dashboard"""
    
    # Generate mock wealth trend data for last 6 months
    today = datetime.now().date()
    wealth_trend = []
    base_wealth = 500000
    
    for i in range(6):
        trend_date = today - timedelta(days=30 * (5-i))
        # Add some realistic growth with volatility
        growth_factor = 1 + (i * 0.02) + ((-1)**i * 0.01)  # 2% monthly growth with some volatility
        
        wealth_trend.append(WealthTrendData(
            date=trend_date.isoformat(),
            total_wealth=base_wealth * growth_factor,
            cash_savings=25000 * growth_factor * 0.5,
            stocks_securities=75000 * growth_factor * 1.2,
            real_estate=450000 * growth_factor * 0.98,
            retirement_accounts=0,
            business_assets=0,
            other_investments=0
        ))
    
    return AnalyticsResponse(
        metrics=DashboardMetrics(
            current_wealth=550000.0,
            wealth_change_3m=25000.0,
            wealth_change_percent=4.8,
            total_income_3m=15000.0,
            total_expenses_3m=9000.0,
            net_savings_3m=6000.0,
            emergency_fund_months=2.8
        ),
        wealth_trend=wealth_trend,
        top_asset_categories={
            "Real Estate": 450000.0,
            "Investments": 75000.0,
            "Cash Savings": 25000.0
        },
        recent_transactions=[
            {
                "id": 1,
                "type": "income",
                "description": "Salary Payment",
                "amount": 5000.0,
                "date": (today - timedelta(days=5)).isoformat(),
                "category": "Employment"
            },
            {
                "id": 2,
                "type": "expense", 
                "description": "Mortgage Payment",
                "amount": -2200.0,
                "date": (today - timedelta(days=7)).isoformat(),
                "category": "Housing"
            },
            {
                "id": 3,
                "type": "investment",
                "description": "Index Fund Purchase",
                "amount": 1000.0,
                "date": (today - timedelta(days=10)).isoformat(),
                "category": "Investments"
            }
        ]
    )