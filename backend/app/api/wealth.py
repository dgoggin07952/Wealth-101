"""
Wealth Management API endpoints
Handles assets, wealth records, and portfolio management
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

from app.models import User, WealthRecord, AssetDetail, get_db
from app.api.auth import get_current_user

router = APIRouter()

class AssetRequest(BaseModel):
    asset_name: str
    asset_category: str
    asset_type: str
    ownership_type: str
    value: float
    description: Optional[str] = ""
    # Property fields
    property_address: Optional[str] = None
    property_type: Optional[str] = None
    purchase_price: Optional[float] = None
    mortgage_balance: Optional[float] = None
    # Investment fields
    investment_type: Optional[str] = None
    broker: Optional[str] = None
    shares_quantity: Optional[float] = None
    # Banking fields
    bank_name: Optional[str] = None
    account_type: Optional[str] = None
    interest_rate: Optional[float] = None

class AssetResponse(BaseModel):
    id: int
    asset_name: str
    asset_category: str
    asset_type: str
    ownership_type: str
    value: float
    description: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class WealthSummaryResponse(BaseModel):
    total_wealth: float
    cash_savings: float
    stocks_securities: float
    real_estate: float
    retirement_accounts: float
    business_assets: float
    other_investments: float
    asset_count: int
    last_updated: Optional[date]

@router.get("/summary", response_model=WealthSummaryResponse)
async def get_wealth_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user's wealth summary"""
    
    # Get all user's assets
    assets = db.query(AssetDetail).filter(AssetDetail.user_id == current_user.id).all()
    
    # Calculate totals by category
    totals = {
        'cash_savings': 0,
        'stocks_securities': 0,
        'real_estate': 0,
        'retirement_accounts': 0,
        'business_assets': 0,
        'other_investments': 0
    }
    
    for asset in assets:
        if asset.asset_category in totals:
            totals[asset.asset_category] += asset.value
    
    total_wealth = sum(totals.values())
    
    # Get latest wealth record date
    latest_record = db.query(WealthRecord).filter(
        WealthRecord.user_id == current_user.id
    ).order_by(WealthRecord.date.desc()).first()
    
    return WealthSummaryResponse(
        total_wealth=total_wealth,
        cash_savings=totals['cash_savings'],
        stocks_securities=totals['stocks_securities'],
        real_estate=totals['real_estate'],
        retirement_accounts=totals['retirement_accounts'],
        business_assets=totals['business_assets'],
        other_investments=totals['other_investments'],
        asset_count=len(assets),
        last_updated=latest_record.date if latest_record else None
    )

@router.get("/assets", response_model=List[AssetResponse])
async def get_assets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all user's assets"""
    
    assets = db.query(AssetDetail).filter(
        AssetDetail.user_id == current_user.id
    ).order_by(AssetDetail.created_at.desc()).all()
    
    return assets

@router.post("/assets", response_model=AssetResponse)
async def create_asset(
    asset_request: AssetRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new asset"""
    
    # Create new asset
    new_asset = AssetDetail(
        user_id=current_user.id,
        wealth_record_id=0,  # Will be updated when wealth record is created
        **asset_request.dict()
    )
    
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)
    
    # Update wealth record
    await update_wealth_record(current_user.id, db)
    
    return new_asset

@router.put("/assets/{asset_id}", response_model=AssetResponse)
async def update_asset(
    asset_id: int,
    asset_request: AssetRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update existing asset"""
    
    # Get asset
    asset = db.query(AssetDetail).filter(
        AssetDetail.id == asset_id,
        AssetDetail.user_id == current_user.id
    ).first()
    
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # Update asset
    for field, value in asset_request.dict().items():
        setattr(asset, field, value)
    
    asset.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(asset)
    
    # Update wealth record
    await update_wealth_record(current_user.id, db)
    
    return asset

@router.delete("/assets/{asset_id}")
async def delete_asset(
    asset_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete asset"""
    
    # Get asset
    asset = db.query(AssetDetail).filter(
        AssetDetail.id == asset_id,
        AssetDetail.user_id == current_user.id
    ).first()
    
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    db.delete(asset)
    db.commit()
    
    # Update wealth record
    await update_wealth_record(current_user.id, db)
    
    return {"message": "Asset deleted successfully"}

async def update_wealth_record(user_id: int, db: Session):
    """Update user's wealth record based on current assets"""
    
    # Get all user's assets
    assets = db.query(AssetDetail).filter(AssetDetail.user_id == user_id).all()
    
    # Calculate totals by category
    totals = {
        'cash_savings': 0,
        'stocks_securities': 0,
        'real_estate': 0,
        'retirement_accounts': 0,
        'business_assets': 0,
        'other_investments': 0
    }
    
    for asset in assets:
        if asset.asset_category in totals:
            totals[asset.asset_category] += asset.value
    
    total_wealth = sum(totals.values())
    today = date.today()
    
    # Check if wealth record exists for today
    existing_record = db.query(WealthRecord).filter(
        WealthRecord.user_id == user_id,
        WealthRecord.date == today
    ).first()
    
    if existing_record:
        # Update existing record
        existing_record.cash_savings = totals['cash_savings']
        existing_record.stocks_securities = totals['stocks_securities']
        existing_record.real_estate = totals['real_estate']
        existing_record.retirement_accounts = totals['retirement_accounts']
        existing_record.business_assets = totals['business_assets']
        existing_record.other_investments = totals['other_investments']
        existing_record.total_wealth = total_wealth
        existing_record.updated_at = datetime.utcnow()
    else:
        # Create new record
        new_record = WealthRecord(
            user_id=user_id,
            date=today,
            cash_savings=totals['cash_savings'],
            stocks_securities=totals['stocks_securities'],
            real_estate=totals['real_estate'],
            retirement_accounts=totals['retirement_accounts'],
            business_assets=totals['business_assets'],
            other_investments=totals['other_investments'],
            total_wealth=total_wealth
        )
        db.add(new_record)
    
    db.commit()

@router.get("/history")
async def get_wealth_history(
    days: int = 90,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get wealth history for charts"""
    
    from datetime import timedelta
    start_date = date.today() - timedelta(days=days)
    
    records = db.query(WealthRecord).filter(
        WealthRecord.user_id == current_user.id,
        WealthRecord.date >= start_date
    ).order_by(WealthRecord.date).all()
    
    return [
        {
            "date": record.date.isoformat(),
            "total_wealth": record.total_wealth,
            "cash_savings": record.cash_savings,
            "stocks_securities": record.stocks_securities,
            "real_estate": record.real_estate,
            "retirement_accounts": record.retirement_accounts,
            "business_assets": record.business_assets,
            "other_investments": record.other_investments
        }
        for record in records
    ]