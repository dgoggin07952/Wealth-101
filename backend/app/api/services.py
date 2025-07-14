"""
Additional services API for will creation, insurance, and financial advice
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import json

from app.models import User, get_db
from app.api.auth import get_current_user

router = APIRouter()

class ServiceRequest(BaseModel):
    service_type: str  # "simple_will", "complex_will", "life_insurance", "financial_advice"
    user_details: dict
    contact_preference: str = "email"
    notes: Optional[str] = None

class ServiceResponse(BaseModel):
    id: int
    service_type: str
    status: str
    price: float
    created_at: datetime
    estimated_completion: Optional[str] = None

class ServicePricing(BaseModel):
    service_type: str
    price: float
    description: str
    features: List[str]
    estimated_time: str

@router.get("/services/pricing", response_model=List[ServicePricing])
async def get_service_pricing():
    """Get pricing for all available services"""
    
    pricing = [
        ServicePricing(
            service_type="simple_will",
            price=50.00,
            description="Basic will creation service",
            features=[
                "Asset distribution planning",
                "Guardian designation for children",
                "Executor appointment",
                "Legal document preparation",
                "Basic tax considerations"
            ],
            estimated_time="5-7 business days"
        ),
        ServicePricing(
            service_type="complex_will",
            price=150.00,
            description="Complex will with trust arrangements",
            features=[
                "Everything in simple will",
                "Trust structure setup",
                "Tax optimization strategies",
                "Business succession planning",
                "Charitable giving arrangements",
                "Multiple property considerations"
            ],
            estimated_time="10-14 business days"
        ),
        ServicePricing(
            service_type="life_insurance",
            price=100.00,
            description="Life insurance consultation and setup",
            features=[
                "Needs analysis based on your wealth data",
                "Policy comparison from multiple providers",
                "Application assistance",
                "Beneficiary setup",
                "Annual review scheduling"
            ],
            estimated_time="2-3 business days"
        ),
        ServicePricing(
            service_type="financial_advice",
            price=50.00,
            description="Financial advisor referral service",
            features=[
                "Matching with qualified advisors",
                "Initial consultation arrangement",
                "Wealth data sharing (with permission)",
                "Follow-up support",
                "Advisor performance tracking"
            ],
            estimated_time="1-2 business days"
        )
    ]
    
    return pricing

@router.post("/services/request", response_model=ServiceResponse)
async def request_service(
    request: ServiceRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Request a service (will, insurance, financial advice)"""
    
    # Validate service type and get pricing
    service_prices = {
        "simple_will": 50.00,
        "complex_will": 150.00,
        "life_insurance": 100.00,
        "financial_advice": 50.00
    }
    
    if request.service_type not in service_prices:
        raise HTTPException(
            status_code=400,
            detail="Invalid service type"
        )
    
    # In a real implementation, you would:
    # 1. Create a service request record in the database
    # 2. Send notification to service providers
    # 3. Process payment
    # 4. Schedule follow-up
    
    # For now, return a mock response
    return ServiceResponse(
        id=12345,
        service_type=request.service_type,
        status="pending",
        price=service_prices[request.service_type],
        created_at=datetime.now(),
        estimated_completion="5-7 business days"
    )

@router.get("/services/my-requests", response_model=List[ServiceResponse])
async def get_my_service_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all service requests for the current user"""
    
    # In a real implementation, query the database for user's service requests
    # For now, return mock data
    return [
        ServiceResponse(
            id=12345,
            service_type="simple_will",
            status="completed",
            price=50.00,
            created_at=datetime.now(),
            estimated_completion="Completed"
        )
    ]

@router.get("/services/referral-partners")
async def get_referral_partners():
    """Get list of trusted referral partners"""
    
    partners = {
        "financial_advisors": [
            {
                "name": "WealthPro Advisory",
                "specialties": ["Investment planning", "Retirement planning"],
                "location": "London, UK",
                "min_wealth": 50000,
                "commission": 50.00
            },
            {
                "name": "Premier Financial Services",
                "specialties": ["Estate planning", "Tax optimization"],
                "location": "Manchester, UK", 
                "min_wealth": 100000,
                "commission": 50.00
            }
        ],
        "legal_services": [
            {
                "name": "Estate Law Partners",
                "specialties": ["Will creation", "Trust planning"],
                "location": "Birmingham, UK",
                "simple_will_fee": 50.00,
                "complex_will_fee": 150.00
            }
        ],
        "insurance_providers": [
            {
                "name": "LifeSecure Insurance",
                "specialties": ["Life insurance", "Critical illness"],
                "location": "Edinburgh, UK",
                "setup_fee": 100.00
            }
        ]
    }
    
    return partners

@router.post("/services/referral/{partner_id}")
async def create_referral(
    partner_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a referral to a partner service"""
    
    # In a real implementation:
    # 1. Validate partner exists
    # 2. Create referral record
    # 3. Send user info to partner (with permission)
    # 4. Track referral for commission
    
    return {
        "message": "Referral created successfully",
        "referral_id": f"REF-{partner_id}-{current_user.id}",
        "commission_earned": 50.00
    }