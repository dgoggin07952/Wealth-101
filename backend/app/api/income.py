"""
Income API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

from app.models import User, get_db
from app.api.auth import get_current_user

router = APIRouter()

class IncomeCreate(BaseModel):
    income_name: str
    amount: float
    category: str
    frequency: str
    description: Optional[str] = ""

class IncomeUpdate(BaseModel):
    income_name: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    frequency: Optional[str] = None
    description: Optional[str] = None

class IncomeResponse(BaseModel):
    id: int
    income_name: str
    amount: float
    income_date: str
    category: str
    frequency: str
    tax_status: str
    description: str

# Mock data storage (in production this would be in database)
mock_income_records = [
    IncomeResponse(
        id=1,
        income_name="Monthly Salary",
        amount=5000.0,
        income_date="2025-01-01",
        category="Salary",
        frequency="monthly",
        tax_status="Taxable",
        description="Regular salary payment"
    ),
    IncomeResponse(
        id=2,
        income_name="Dividend Payment",
        amount=250.0,
        income_date="2025-01-05",
        category="Investment Returns",
        frequency="quarterly",
        tax_status="Taxable",
        description="FTSE 100 Index dividend"
    )
]

@router.get("", response_model=List[IncomeResponse])
async def get_income(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all income records for current user"""
    return mock_income_records

@router.post("", response_model=IncomeResponse)
async def create_income(
    income_data: IncomeCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Create new income record"""
    new_id = max([record.id for record in mock_income_records], default=0) + 1
    new_record = IncomeResponse(
        id=new_id,
        income_name=income_data.income_name,
        amount=income_data.amount,
        income_date=datetime.now().date().isoformat(),
        category=income_data.category,
        frequency=income_data.frequency,
        tax_status="Taxable",
        description=income_data.description or ""
    )
    mock_income_records.append(new_record)
    return new_record

@router.put("/{income_id}", response_model=IncomeResponse)
async def update_income(
    income_id: int,
    income_data: IncomeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update existing income record"""
    for i, record in enumerate(mock_income_records):
        if record.id == income_id:
            updated_data = record.dict()
            for field, value in income_data.dict(exclude_unset=True).items():
                if field == "income_name":
                    updated_data["income_name"] = value
                elif field == "amount":
                    updated_data["amount"] = value
                elif field == "category":
                    updated_data["category"] = value
                elif field == "frequency":
                    updated_data["frequency"] = value
                elif field == "description":
                    updated_data["description"] = value
            
            updated_record = IncomeResponse(**updated_data)
            mock_income_records[i] = updated_record
            return updated_record
    
    raise HTTPException(status_code=404, detail="Income record not found")

@router.delete("/{income_id}")
async def delete_income(
    income_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete income record"""
    for i, record in enumerate(mock_income_records):
        if record.id == income_id:
            mock_income_records.pop(i)
            return {"message": "Income record deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Income record not found")