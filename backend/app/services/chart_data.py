"""
Chart data service for visualizations
"""
from sqlalchemy.orm import Session
from app.models import WealthRecord, AssetDetail
from datetime import date, timedelta

def get_wealth_trend_data(user_id: int, db: Session, days: int = 90) -> dict:
    """Get wealth trend data for charts"""
    
    start_date = date.today() - timedelta(days=days)
    
    records = db.query(WealthRecord).filter(
        WealthRecord.user_id == user_id,
        WealthRecord.date >= start_date
    ).order_by(WealthRecord.date).all()
    
    return {
        "dates": [record.date.isoformat() for record in records],
        "values": [record.total_wealth for record in records],
        "categories": {
            "cash_savings": [record.cash_savings for record in records],
            "stocks_securities": [record.stocks_securities for record in records],
            "real_estate": [record.real_estate for record in records],
            "retirement_accounts": [record.retirement_accounts for record in records],
            "business_assets": [record.business_assets for record in records],
            "other_investments": [record.other_investments for record in records]
        }
    }

def get_asset_allocation_data(user_id: int, db: Session) -> dict:
    """Get asset allocation data for pie charts"""
    
    assets = db.query(AssetDetail).filter(AssetDetail.user_id == user_id).all()
    
    # Group by category
    allocation = {}
    for asset in assets:
        category = asset.asset_category
        if category not in allocation:
            allocation[category] = 0
        allocation[category] += asset.value
    
    return {
        "labels": list(allocation.keys()),
        "values": list(allocation.values())
    }