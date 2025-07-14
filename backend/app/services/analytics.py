"""
Analytics service for dashboard data
"""
from sqlalchemy.orm import Session
from app.models import User, AssetDetail, WealthRecord

def get_user_analytics(user_id: int, db: Session) -> dict:
    """Get analytics data for user dashboard"""
    
    # Get basic asset data
    assets = db.query(AssetDetail).filter(AssetDetail.user_id == user_id).all()
    
    return {
        "total_assets": len(assets),
        "total_value": sum(asset.value for asset in assets),
        "growth_rate": 5.2,  # Placeholder
        "monthly_change": 1250.0  # Placeholder
    }