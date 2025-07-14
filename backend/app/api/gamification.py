"""
Gamification API endpoints for badges, streaks, and achievements
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime, date, timedelta

from ..models import get_db, User
from ..api.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class BadgeResponse(BaseModel):
    badge_id: str
    earned_at: datetime
    
class StreakResponse(BaseModel):
    current_streak: int
    longest_streak: int
    last_login: datetime
    streak_active: bool
    
class ProgressResponse(BaseModel):
    current_wealth: float
    year_start_wealth: float
    month_start_wealth: float
    year_goal: float
    next_milestone: float

@router.get("/badges", response_model=List[BadgeResponse])
async def get_user_badges(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all badges earned by the current user"""
    # For now, return mock data based on user activity
    # In a real implementation, you would query a badges table
    mock_badges = [
        {
            "badge_id": "first_login",
            "earned_at": datetime.now() - timedelta(days=10)
        },
        {
            "badge_id": "wealth_tracker", 
            "earned_at": datetime.now() - timedelta(days=8)
        },
        {
            "badge_id": "consistent_user",
            "earned_at": datetime.now() - timedelta(days=1)
        }
    ]
    return mock_badges

@router.get("/streak", response_model=StreakResponse)
async def get_user_streak(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user's login streak information"""
    # For now, return mock data
    # In a real implementation, you would track login dates
    return {
        "current_streak": 7,
        "longest_streak": 12,
        "last_login": datetime.now(),
        "streak_active": True
    }

@router.get("/wealth-progress", response_model=ProgressResponse)
async def get_wealth_progress(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user's wealth progress for motivation"""
    # For now, return mock data
    # In a real implementation, you would calculate from historical wealth records
    return {
        "current_wealth": 145000.0,
        "year_start_wealth": 120000.0,
        "month_start_wealth": 142000.0,
        "year_goal": 200000.0,
        "next_milestone": 150000.0
    }

@router.post("/update-streak")
async def update_login_streak(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update user's login streak (called on each login)"""
    # In a real implementation, you would update the user's streak data
    return {"message": "Streak updated successfully"}

@router.post("/award-badge")
async def award_badge(badge_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Award a badge to the user"""
    # In a real implementation, you would check if user qualifies and award the badge
    return {"message": f"Badge {badge_id} awarded successfully"}

@router.get("/achievements-summary")
async def get_achievements_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get a summary of user's achievements for dashboard preview"""
    return {
        "total_badges": 30,
        "earned_badges": 8,
        "current_streak": 7,
        "streak_active": True,
        "wealth_growth_this_year": 25000.0,
        "next_milestone": 150000.0,
        "current_wealth": 145000.0
    }

class DailyGoal(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    points: int
    completed: bool
    action: str

class DailyGoalsResponse(BaseModel):
    goals: List[DailyGoal]
    completed_today: int
    total_xp_today: int
    streak_bonus: int

@router.get("/daily-goals", response_model=DailyGoalsResponse)
async def get_daily_goals(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user's daily goals"""
    # Mock data for daily goals
    goals = [
        {
            "id": "update_wealth",
            "title": "Update Your Wealth",
            "description": "Add or update an asset in your portfolio",
            "icon": "💰",
            "points": 50,
            "completed": False,
            "action": "/wealth"
        },
        {
            "id": "complete_task",
            "title": "Complete a Task",
            "description": "Finish an item from your Things To Do list",
            "icon": "✅",
            "points": 30,
            "completed": False,
            "action": "/"
        },
        {
            "id": "check_milestones",
            "title": "Review Milestones",
            "description": "Check progress on your financial goals",
            "icon": "🎯",
            "points": 25,
            "completed": False,
            "action": "/milestones"
        },
        {
            "id": "add_income",
            "title": "Log Income/Expense",
            "description": "Track your income or expenses",
            "icon": "💸",
            "points": 35,
            "completed": False,
            "action": "/income"
        },
        {
            "id": "generate_report",
            "title": "Generate Report",
            "description": "Create a financial health report",
            "icon": "📊",
            "points": 40,
            "completed": False,
            "action": "/reports"
        }
    ]
    
    return {
        "goals": goals,
        "completed_today": 0,
        "total_xp_today": 0,
        "streak_bonus": 0
    }

@router.post("/daily-goals/{goal_id}/complete")
async def complete_daily_goal(goal_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Mark a daily goal as completed"""
    # In a real implementation, you would update the database
    return {"message": f"Goal {goal_id} completed successfully", "xp_earned": 50}