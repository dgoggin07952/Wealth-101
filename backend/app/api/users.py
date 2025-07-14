"""
User Management API endpoints
Personal information, income, expenses, milestones
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

from app.models import User, IncomeRecord, ExpenseRecord, Milestone, get_db
from app.api.auth import get_current_user

router = APIRouter()

class PersonalInfoUpdate(BaseModel):
    name: Optional[str] = None
    home_country: Optional[str] = None
    home_currency: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    solicitor_name: Optional[str] = None
    solicitor_email: Optional[str] = None

class IncomeRequest(BaseModel):
    income_name: str
    amount: float
    income_date: date
    category: str
    frequency: str = "One-time"
    tax_status: str = "Taxable"
    description: str = ""

class ExpenseRequest(BaseModel):
    expense_name: str
    amount: float
    expense_date: date
    category: str
    frequency: str = "One-time"
    payment_method: str = "Cash"
    description: str = ""

class MilestoneRequest(BaseModel):
    title: str
    description: str = ""
    category: str
    target_amount: float
    target_date: date
    current_amount: float = 0.0

class MilestoneUpdateRequest(BaseModel):
    current_amount: Optional[float] = None
    is_completed: Optional[bool] = None

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get user profile information"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "home_country": current_user.home_country,
        "home_currency": current_user.home_currency,
        "date_of_birth": current_user.date_of_birth,
        "phone_number": current_user.phone_number,
        "address": current_user.address,
        "emergency_contact_name": current_user.emergency_contact_name,
        "emergency_contact_phone": current_user.emergency_contact_phone,
        "solicitor_name": current_user.solicitor_name,
        "solicitor_email": current_user.solicitor_email,
        "user_type": current_user.user_type,
        "created_at": current_user.created_at
    }

@router.put("/profile")
async def update_profile(
    update_data: PersonalInfoUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile information"""
    
    # Update only provided fields
    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Profile updated successfully"}

# Income endpoints
@router.get("/income")
async def get_income_records(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all income records"""
    
    records = db.query(IncomeRecord).filter(
        IncomeRecord.user_id == current_user.id
    ).order_by(IncomeRecord.income_date.desc()).all()
    
    return records

@router.post("/income")
async def create_income_record(
    income_request: IncomeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new income record"""
    
    new_income = IncomeRecord(
        user_id=current_user.id,
        **income_request.dict()
    )
    
    db.add(new_income)
    db.commit()
    db.refresh(new_income)
    
    return new_income

@router.delete("/income/{income_id}")
async def delete_income_record(
    income_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete income record"""
    
    record = db.query(IncomeRecord).filter(
        IncomeRecord.id == income_id,
        IncomeRecord.user_id == current_user.id
    ).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Income record not found")
    
    db.delete(record)
    db.commit()
    
    return {"message": "Income record deleted successfully"}

# Expense endpoints
@router.get("/expenses")
async def get_expense_records(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all expense records"""
    
    records = db.query(ExpenseRecord).filter(
        ExpenseRecord.user_id == current_user.id
    ).order_by(ExpenseRecord.expense_date.desc()).all()
    
    return records

@router.post("/expenses")
async def create_expense_record(
    expense_request: ExpenseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new expense record"""
    
    new_expense = ExpenseRecord(
        user_id=current_user.id,
        **expense_request.dict()
    )
    
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    
    return new_expense

@router.delete("/expenses/{expense_id}")
async def delete_expense_record(
    expense_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete expense record"""
    
    record = db.query(ExpenseRecord).filter(
        ExpenseRecord.id == expense_id,
        ExpenseRecord.user_id == current_user.id
    ).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Expense record not found")
    
    db.delete(record)
    db.commit()
    
    return {"message": "Expense record deleted successfully"}

# Milestone endpoints
@router.get("/milestones")
async def get_milestones(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all milestones"""
    
    milestones = db.query(Milestone).filter(
        Milestone.user_id == current_user.id
    ).order_by(Milestone.target_date).all()
    
    return milestones

@router.post("/milestones")
async def create_milestone(
    milestone_request: MilestoneRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new milestone"""
    
    new_milestone = Milestone(
        user_id=current_user.id,
        **milestone_request.dict()
    )
    
    db.add(new_milestone)
    db.commit()
    db.refresh(new_milestone)
    
    return new_milestone

@router.put("/milestones/{milestone_id}")
async def update_milestone(
    milestone_id: int,
    update_request: MilestoneUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update milestone progress"""
    
    milestone = db.query(Milestone).filter(
        Milestone.id == milestone_id,
        Milestone.user_id == current_user.id
    ).first()
    
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    # Update provided fields
    for field, value in update_request.dict(exclude_unset=True).items():
        setattr(milestone, field, value)
    
    milestone.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(milestone)
    
    return milestone

@router.delete("/milestones/{milestone_id}")
async def delete_milestone(
    milestone_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete milestone"""
    
    milestone = db.query(Milestone).filter(
        Milestone.id == milestone_id,
        Milestone.user_id == current_user.id
    ).first()
    
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    db.delete(milestone)
    db.commit()
    
    return {"message": "Milestone deleted successfully"}