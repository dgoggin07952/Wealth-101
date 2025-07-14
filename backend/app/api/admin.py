"""
Admin API endpoints for business owner dashboard
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import json

from app.models import User, WealthRecord, AssetDetail, IncomeRecord, ExpenseRecord, Milestone, get_db
from app.api.auth import get_current_user

router = APIRouter()

class AdminStats(BaseModel):
    total_users: int
    active_users: int
    total_wealth_managed: float
    avg_wealth_per_user: float
    new_users_this_month: int
    top_asset_categories: dict
    user_growth_trend: List[dict]

class UserSummary(BaseModel):
    id: int
    name: str
    email: str
    total_wealth: float
    last_login: Optional[datetime]
    created_at: datetime
    is_active: bool
    asset_count: int
    home_currency: str

class DetailedUserView(BaseModel):
    id: int
    name: str
    email: str
    phone_number: Optional[str]
    home_country: str
    home_currency: str
    total_wealth: float
    total_assets: float
    total_liabilities: float
    monthly_income: float
    monthly_expenses: float
    asset_breakdown: dict
    milestone_count: int
    last_wealth_update: Optional[datetime]
    created_at: datetime
    is_active: bool

def check_admin_access(current_user: User = Depends(get_current_user)):
    """Verify user has admin access"""
    if current_user.user_type != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

@router.get("/admin/stats", response_model=AdminStats)
async def get_admin_stats(
    admin_user: User = Depends(check_admin_access),
    db: Session = Depends(get_db)
):
    """Get comprehensive admin dashboard statistics"""
    
    # Basic user stats
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    
    # Wealth statistics
    latest_wealth = db.query(
        func.sum(WealthRecord.total_wealth).label('total_wealth'),
        func.avg(WealthRecord.total_wealth).label('avg_wealth')
    ).first()
    
    total_wealth_managed = latest_wealth.total_wealth or 0
    avg_wealth_per_user = latest_wealth.avg_wealth or 0
    
    # New users this month
    thirty_days_ago = datetime.now() - timedelta(days=30)
    new_users_this_month = db.query(User).filter(
        User.created_at >= thirty_days_ago
    ).count()
    
    # Top asset categories
    asset_categories = db.query(
        AssetDetail.asset_category,
        func.sum(AssetDetail.value).label('total_value')
    ).group_by(AssetDetail.asset_category).all()
    
    top_asset_categories = {
        category: float(total_value) for category, total_value in asset_categories
    }
    
    # User growth trend (last 6 months)
    user_growth_trend = []
    for i in range(6):
        month_start = datetime.now() - timedelta(days=30 * (i + 1))
        month_end = datetime.now() - timedelta(days=30 * i)
        
        users_in_month = db.query(User).filter(
            User.created_at >= month_start,
            User.created_at < month_end
        ).count()
        
        user_growth_trend.append({
            'month': month_start.strftime('%Y-%m'),
            'new_users': users_in_month
        })
    
    return AdminStats(
        total_users=total_users,
        active_users=active_users,
        total_wealth_managed=total_wealth_managed,
        avg_wealth_per_user=avg_wealth_per_user,
        new_users_this_month=new_users_this_month,
        top_asset_categories=top_asset_categories,
        user_growth_trend=user_growth_trend
    )

@router.get("/admin/users", response_model=List[UserSummary])
async def get_all_users(
    admin_user: User = Depends(check_admin_access),
    db: Session = Depends(get_db),
    limit: int = 100,
    offset: int = 0
):
    """Get all users with summary information"""
    
    users = db.query(User).order_by(desc(User.created_at)).offset(offset).limit(limit).all()
    
    user_summaries = []
    for user in users:
        # Get latest wealth record
        latest_wealth = db.query(WealthRecord.total_wealth).filter(
            WealthRecord.user_id == user.id
        ).order_by(desc(WealthRecord.date)).first()
        
        total_wealth = latest_wealth.total_wealth if latest_wealth else 0
        
        # Get asset count
        asset_count = db.query(AssetDetail).filter(
            AssetDetail.user_id == user.id
        ).count()
        
        user_summaries.append(UserSummary(
            id=user.id,
            name=user.name,
            email=user.email,
            total_wealth=total_wealth,
            last_login=user.updated_at,  # Using updated_at as proxy for last login
            created_at=user.created_at,
            is_active=user.is_active,
            asset_count=asset_count,
            home_currency=user.home_currency
        ))
    
    return user_summaries

@router.get("/admin/users/{user_id}", response_model=DetailedUserView)
async def get_user_details(
    user_id: int,
    admin_user: User = Depends(check_admin_access),
    db: Session = Depends(get_db)
):
    """Get detailed view of a specific user"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get latest wealth record
    latest_wealth = db.query(WealthRecord).filter(
        WealthRecord.user_id == user_id
    ).order_by(desc(WealthRecord.date)).first()
    
    total_wealth = latest_wealth.total_wealth if latest_wealth else 0
    
    # Get asset breakdown
    assets = db.query(AssetDetail).filter(AssetDetail.user_id == user_id).all()
    asset_breakdown = {}
    total_assets = 0
    total_liabilities = 0
    
    for asset in assets:
        category = asset.asset_category
        if category not in asset_breakdown:
            asset_breakdown[category] = 0
        asset_breakdown[category] += asset.value
        total_assets += asset.value
        
        # Add liabilities (mortgage balances)
        if asset.mortgage_balance:
            total_liabilities += asset.mortgage_balance
    
    # Get income/expense data (last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    monthly_income = db.query(func.sum(IncomeRecord.amount)).filter(
        IncomeRecord.user_id == user_id,
        IncomeRecord.income_date >= thirty_days_ago
    ).scalar() or 0
    
    monthly_expenses = db.query(func.sum(ExpenseRecord.amount)).filter(
        ExpenseRecord.user_id == user_id,
        ExpenseRecord.expense_date >= thirty_days_ago
    ).scalar() or 0
    
    # Get milestone count
    milestone_count = db.query(Milestone).filter(Milestone.user_id == user_id).count()
    
    return DetailedUserView(
        id=user.id,
        name=user.name,
        email=user.email,
        phone_number=user.phone_number,
        home_country=user.home_country,
        home_currency=user.home_currency,
        total_wealth=total_wealth,
        total_assets=total_assets,
        total_liabilities=total_liabilities,
        monthly_income=monthly_income,
        monthly_expenses=monthly_expenses,
        asset_breakdown=asset_breakdown,
        milestone_count=milestone_count,
        last_wealth_update=latest_wealth.date if latest_wealth else None,
        created_at=user.created_at,
        is_active=user.is_active
    )

@router.post("/admin/users/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: int,
    admin_user: User = Depends(check_admin_access),
    db: Session = Depends(get_db)
):
    """Toggle user active status"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = not user.is_active
    db.commit()
    
    return {"message": f"User {'activated' if user.is_active else 'deactivated'} successfully"}

@router.get("/admin/export/users")
async def export_users_csv(
    admin_user: User = Depends(check_admin_access),
    db: Session = Depends(get_db)
):
    """Export all users to CSV for marketing purposes"""
    
    users = db.query(User).all()
    
    csv_data = "name,email,home_country,home_currency,total_wealth,created_at,is_active\n"
    
    for user in users:
        # Get latest wealth
        latest_wealth = db.query(WealthRecord.total_wealth).filter(
            WealthRecord.user_id == user.id
        ).order_by(desc(WealthRecord.date)).first()
        
        total_wealth = latest_wealth.total_wealth if latest_wealth else 0
        
        csv_data += f"{user.name},{user.email},{user.home_country},{user.home_currency},{total_wealth},{user.created_at},{user.is_active}\n"
    
    return {"csv_data": csv_data}