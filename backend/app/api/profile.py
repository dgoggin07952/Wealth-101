"""
Profile API endpoints for user personal information
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.models import User, get_db
from app.api.auth import get_current_user

router = APIRouter()

class ProfileResponse(BaseModel):
    name: str
    email: str
    home_country: str
    home_currency: str
    date_of_birth: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    national_insurance_number: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None

@router.get("", response_model=ProfileResponse)
async def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user profile information"""
    
    return ProfileResponse(
        name=current_user.name or "Demo User",
        email=current_user.email,
        home_country=current_user.home_country or "United Kingdom",
        home_currency=current_user.home_currency or "GBP",
        date_of_birth=current_user.date_of_birth.isoformat() if current_user.date_of_birth else None,
        phone_number=current_user.phone_number,
        address=current_user.address,
        national_insurance_number=current_user.national_insurance_number,
        emergency_contact_name=current_user.emergency_contact_name,
        emergency_contact_phone=current_user.emergency_contact_phone,
        emergency_contact_relationship=current_user.emergency_contact_relationship
    )