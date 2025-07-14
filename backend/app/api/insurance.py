"""
Insurance API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

from app.models import User, InsurancePolicy, get_db
from app.api.auth import get_current_user

router = APIRouter()

class InsurancePolicyCreateRequest(BaseModel):
    policy_type: str
    provider: str
    coverage_amount: float
    monthly_premium: float
    policy_number: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class InsurancePolicyResponse(BaseModel):
    id: int
    policy_type: str
    provider: str
    coverage_amount: float
    monthly_premium: float
    policy_number: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

class InsuranceSummaryResponse(BaseModel):
    total_policies: int
    total_monthly_premium: float
    total_coverage: float
    coverage_by_type: dict
    protection_gap: float
    coverage_percentage: float
    coverage_breakdown: dict

@router.get("", response_model=List[InsurancePolicyResponse])
async def get_insurance_policies(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all insurance policies for current user"""
    policies = db.query(InsurancePolicy).filter(
        InsurancePolicy.user_id == current_user.id,
        InsurancePolicy.is_active == True
    ).all()
    return policies

@router.get("/summary", response_model=InsuranceSummaryResponse)
async def get_insurance_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get insurance summary for current user"""
    policies = db.query(InsurancePolicy).filter(
        InsurancePolicy.user_id == current_user.id,
        InsurancePolicy.is_active == True
    ).all()
    
    total_policies = len(policies)
    total_monthly_premium = sum(p.monthly_premium for p in policies)
    total_coverage = sum(p.coverage_amount for p in policies)
    
    coverage_by_type = {}
    for policy in policies:
        if policy.policy_type not in coverage_by_type:
            coverage_by_type[policy.policy_type] = 0
        coverage_by_type[policy.policy_type] += policy.coverage_amount
    
    # Calculate percentage-based coverage system
    # Each insurance type contributes 33% to total coverage
    coverage_scores = {
        'income': 0,
        'family': 0, 
        'inheritance': 0
    }
    
    # Income protection: Monthly payout (target: £3,750/month)
    if 'income' in coverage_by_type:
        income_coverage = coverage_by_type['income']
        coverage_scores['income'] = min(100, (income_coverage / 3750) * 100)
    
    # Family protection: Lump sum (target: £500,000)
    if 'family' in coverage_by_type:
        family_coverage = coverage_by_type['family']
        coverage_scores['family'] = min(100, (family_coverage / 500000) * 100)
    
    # Inheritance tax: Lump sum (target: £100,000)
    if 'inheritance' in coverage_by_type:
        inheritance_coverage = coverage_by_type['inheritance']
        coverage_scores['inheritance'] = min(100, (inheritance_coverage / 100000) * 100)
    
    # Calculate overall coverage percentage (each type worth 33.33%)
    coverage_percentage = (
        coverage_scores['income'] * 0.3333 +
        coverage_scores['family'] * 0.3333 +
        coverage_scores['inheritance'] * 0.3333
    )
    
    # Protection gap as percentage missing
    protection_gap = 100 - coverage_percentage
    
    coverage_breakdown = {
        'income_percentage': coverage_scores['income'],
        'family_percentage': coverage_scores['family'],
        'inheritance_percentage': coverage_scores['inheritance']
    }
    
    return InsuranceSummaryResponse(
        total_policies=total_policies,
        total_monthly_premium=total_monthly_premium,
        total_coverage=total_coverage,
        coverage_by_type=coverage_by_type,
        protection_gap=protection_gap,
        coverage_percentage=coverage_percentage,
        coverage_breakdown=coverage_breakdown
    )

@router.post("", response_model=InsurancePolicyResponse)
async def create_insurance_policy(
    request: InsurancePolicyCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new insurance policy"""
    policy = InsurancePolicy(
        user_id=current_user.id,
        policy_type=request.policy_type,
        provider=request.provider,
        coverage_amount=request.coverage_amount,
        monthly_premium=request.monthly_premium,
        policy_number=request.policy_number,
        start_date=request.start_date,
        end_date=request.end_date
    )
    
    db.add(policy)
    db.commit()
    db.refresh(policy)
    
    return policy

@router.put("/{policy_id}", response_model=InsurancePolicyResponse)
async def update_insurance_policy(
    policy_id: int,
    request: InsurancePolicyCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update existing insurance policy"""
    policy = db.query(InsurancePolicy).filter(
        InsurancePolicy.id == policy_id,
        InsurancePolicy.user_id == current_user.id
    ).first()
    
    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Insurance policy not found"
        )
    
    policy.policy_type = request.policy_type
    policy.provider = request.provider
    policy.coverage_amount = request.coverage_amount
    policy.monthly_premium = request.monthly_premium
    policy.policy_number = request.policy_number
    policy.start_date = request.start_date
    policy.end_date = request.end_date
    policy.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(policy)
    
    return policy

@router.delete("/{policy_id}")
async def delete_insurance_policy(
    policy_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete insurance policy"""
    policy = db.query(InsurancePolicy).filter(
        InsurancePolicy.id == policy_id,
        InsurancePolicy.user_id == current_user.id
    ).first()
    
    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Insurance policy not found"
        )
    
    policy.is_active = False
    policy.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Insurance policy deleted successfully"}