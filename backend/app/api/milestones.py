"""
Milestones API endpoints for financial goal tracking
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import date

from app.models import User, Milestone, get_db
from app.api.auth import get_current_user

router = APIRouter()

class MilestoneRequest(BaseModel):
    title: str
    description: str = ""
    category: str
    target_amount: float
    current_amount: float = 0.0
    target_date: date
    is_completed: bool = False

class MilestoneResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    target_amount: float
    current_amount: float
    target_date: str
    is_completed: bool
    progress_percentage: float

@router.get("", response_model=List[MilestoneResponse])
async def get_milestones(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all milestones for current user"""
    
    milestones = db.query(Milestone).filter(
        Milestone.user_id == current_user.id
    ).order_by(Milestone.target_date).all()
    
    milestone_responses = []
    for milestone in milestones:
        progress_percentage = (milestone.current_amount / milestone.target_amount * 100) if milestone.target_amount > 0 else 0
        milestone_responses.append(MilestoneResponse(
            id=milestone.id,
            title=milestone.title,
            description=milestone.description,
            category=milestone.category,
            target_amount=milestone.target_amount,
            current_amount=milestone.current_amount,
            target_date=milestone.target_date.isoformat(),
            is_completed=milestone.is_completed,
            progress_percentage=round(progress_percentage, 1)
        ))
    
    return milestone_responses

@router.post("", response_model=MilestoneResponse)
async def create_milestone(
    milestone_request: MilestoneRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new milestone"""
    
    new_milestone = Milestone(
        user_id=current_user.id,
        title=milestone_request.title,
        description=milestone_request.description,
        category=milestone_request.category,
        target_amount=milestone_request.target_amount,
        current_amount=milestone_request.current_amount,
        target_date=milestone_request.target_date,
        is_completed=milestone_request.is_completed
    )
    
    db.add(new_milestone)
    db.commit()
    db.refresh(new_milestone)
    
    progress_percentage = (new_milestone.current_amount / new_milestone.target_amount * 100) if new_milestone.target_amount > 0 else 0
    
    return MilestoneResponse(
        id=new_milestone.id,
        title=new_milestone.title,
        description=new_milestone.description,
        category=new_milestone.category,
        target_amount=new_milestone.target_amount,
        current_amount=new_milestone.current_amount,
        target_date=new_milestone.target_date.isoformat(),
        is_completed=new_milestone.is_completed,
        progress_percentage=round(progress_percentage, 1)
    )