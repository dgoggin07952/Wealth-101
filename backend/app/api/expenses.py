"""
Expenses API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.models import User, get_db
from app.api.auth import get_current_user

router = APIRouter()

class ExpenseCreate(BaseModel):
    expense_name: str
    amount: float
    category: str
    frequency: str
    description: Optional[str] = ""

class ExpenseUpdate(BaseModel):
    expense_name: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    frequency: Optional[str] = None
    description: Optional[str] = None

class ExpenseResponse(BaseModel):
    id: int
    expense_name: str
    amount: float
    expense_date: str
    category: str
    frequency: str
    payment_method: str
    description: str

# Mock data storage (in production this would be in database)
mock_expense_records = [
    ExpenseResponse(
        id=1,
        expense_name="Mortgage Payment",
        amount=2200.0,
        expense_date="2025-01-01",
        category="Housing",
        frequency="monthly",
        payment_method="Direct Debit",
        description="Monthly mortgage payment"
    ),
    ExpenseResponse(
        id=2,
        expense_name="Grocery Shopping",
        amount=150.0,
        expense_date="2025-01-03",
        category="Food",
        frequency="weekly",
        payment_method="Debit Card",
        description="Weekly grocery shopping"
    )
]

@router.get("", response_model=List[ExpenseResponse])
async def get_expenses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all expense records for current user"""
    return mock_expense_records

@router.post("", response_model=ExpenseResponse)
async def create_expense(
    expense_data: ExpenseCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Create new expense record"""
    new_id = max([record.id for record in mock_expense_records], default=0) + 1
    new_record = ExpenseResponse(
        id=new_id,
        expense_name=expense_data.expense_name,
        amount=expense_data.amount,
        expense_date=datetime.now().date().isoformat(),
        category=expense_data.category,
        frequency=expense_data.frequency,
        payment_method="Debit Card",
        description=expense_data.description or ""
    )
    mock_expense_records.append(new_record)
    return new_record

@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update existing expense record"""
    for i, record in enumerate(mock_expense_records):
        if record.id == expense_id:
            updated_data = record.dict()
            for field, value in expense_data.dict(exclude_unset=True).items():
                if field == "expense_name":
                    updated_data["expense_name"] = value
                elif field == "amount":
                    updated_data["amount"] = value
                elif field == "category":
                    updated_data["category"] = value
                elif field == "frequency":
                    updated_data["frequency"] = value
                elif field == "description":
                    updated_data["description"] = value
            
            updated_record = ExpenseResponse(**updated_data)
            mock_expense_records[i] = updated_record
            return updated_record
    
    raise HTTPException(status_code=404, detail="Expense record not found")

@router.delete("/{expense_id}")
async def delete_expense(
    expense_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete expense record"""
    for i, record in enumerate(mock_expense_records):
        if record.id == expense_id:
            mock_expense_records.pop(i)
            return {"message": "Expense record deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Expense record not found")