"""
Assets API endpoints for wealth management
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime, date

from app.models import User, AssetDetail, get_db
from app.api.auth import get_current_user

router = APIRouter()

class AssetCreateRequest(BaseModel):
    asset_name: str
    asset_category: str
    asset_type: str
    ownership_type: str
    value: float
    description: Optional[str] = ""
    company_name: Optional[str] = None
    
    # Bank account fields
    bank_name: Optional[str] = None
    account_number: Optional[str] = None
    account_type: Optional[str] = None
    interest_rate: Optional[float] = None
    
    # Property fields
    property_address: Optional[str] = None
    property_type: Optional[str] = None
    purchase_price: Optional[float] = None
    purchase_date: Optional[date] = None
    mortgage_balance: Optional[float] = None
    mortgage_rate: Optional[float] = None
    monthly_payment: Optional[float] = None
    mortgage_term: Optional[int] = None
    mortgage_lender: Optional[str] = None
    mortgage_payment_type: Optional[str] = None

class AssetResponse(BaseModel):
    id: int
    asset_name: str
    asset_category: str
    asset_type: str
    ownership_type: str
    value: float
    description: str
    company_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class AssetSummaryResponse(BaseModel):
    total_assets: float
    total_debts: float
    net_worth: float
    asset_categories: Dict[str, float]
    asset_types: Dict[str, float]
    ownership_breakdown: Dict[str, float]

@router.get("", response_model=List[AssetResponse])
async def get_assets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all assets for current user"""
    
    # For now, return mock data until we integrate with existing wealth records
    # In production, this would query AssetDetail table filtered by user
    mock_assets = [
        {
            "id": 1,
            "asset_name": "Primary Residence",
            "asset_category": "real_estate", 
            "asset_type": "property",
            "ownership_type": "joint",
            "value": 450000.0,
            "description": "Family home in London",
            "company_name": None,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "id": 2,
            "asset_name": "Savings Account",
            "asset_category": "cash_savings",
            "asset_type": "bank_account", 
            "ownership_type": "sole",
            "value": 25000.0,
            "description": "Emergency fund savings",
            "company_name": None,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "id": 3,
            "asset_name": "FTSE 100 Index Fund",
            "asset_category": "stocks_securities",
            "asset_type": "investment",
            "ownership_type": "sole", 
            "value": 75000.0,
            "description": "Long-term investment portfolio",
            "company_name": None,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    ]
    
    return mock_assets

@router.get("/summary", response_model=AssetSummaryResponse)
async def get_asset_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get asset summary and breakdown for current user"""
    
    # Mock data based on typical user portfolio
    return AssetSummaryResponse(
        total_assets=550000.0,
        total_debts=0.0,
        net_worth=550000.0,
        asset_categories={
            "real_estate": 450000.0,
            "cash_savings": 25000.0,
            "stocks_securities": 75000.0,
            "retirement_accounts": 0.0,
            "business_assets": 0.0,
            "other_investments": 0.0
        },
        asset_types={
            "property": 450000.0,
            "bank_account": 25000.0,
            "investment": 75000.0
        },
        ownership_breakdown={
            "sole": 100000.0,
            "joint": 450000.0,
            "corporate": 0.0
        }
    )

@router.post("", response_model=AssetResponse)
async def create_asset(request: AssetCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create new asset"""
    
    # For now return mock response
    # In production, this would create AssetDetail record
    return AssetResponse(
        id=999,
        asset_name=request.asset_name,
        asset_category=request.asset_category,
        asset_type=request.asset_type,
        ownership_type=request.ownership_type,
        value=request.value,
        description=request.description or "",
        company_name=request.company_name,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

@router.put("/{asset_id}", response_model=AssetResponse)
async def update_asset(asset_id: int, request: AssetCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update existing asset"""
    
    # Mock response for now
    return AssetResponse(
        id=asset_id,
        asset_name=request.asset_name,
        asset_category=request.asset_category,
        asset_type=request.asset_type,
        ownership_type=request.ownership_type,
        value=request.value,
        description=request.description or "",
        company_name=request.company_name,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

@router.delete("/{asset_id}")
async def delete_asset(asset_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete asset"""
    
    return {"message": "Asset deleted successfully"}