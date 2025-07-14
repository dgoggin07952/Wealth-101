"""
White label partnership API for financial wellness coaches
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json

from app.models import User, get_db
from app.api.auth import get_current_user

router = APIRouter()

class PartnerApplication(BaseModel):
    name: str
    email: EmailStr
    brand_name: str
    website: Optional[str] = None
    social_media: Dict[str, str]  # {"instagram": "@username", "youtube": "channel"}
    audience_size: int
    audience_description: str
    monthly_content_frequency: str
    experience_years: int
    why_interested: str
    referral_source: Optional[str] = None

class PartnerProfile(BaseModel):
    id: int
    name: str
    brand_name: str
    custom_domain: str
    branded_colors: Dict[str, str]
    logo_url: Optional[str] = None
    welcome_message: str
    status: str  # "pending", "approved", "active", "suspended"
    created_at: datetime
    total_users: int
    monthly_revenue: float
    conversion_rate: float

class RevenueReport(BaseModel):
    month: str
    subscription_revenue: float
    service_revenue: float
    total_revenue: float
    partner_share: float
    total_users: int
    new_users: int
    churn_rate: float
    services_sold: Dict[str, int]

class MarketingMaterials(BaseModel):
    email_templates: List[Dict[str, str]]
    social_media_posts: List[Dict[str, str]]
    landing_page_copy: str
    video_scripts: List[str]
    faq_responses: List[Dict[str, str]]

@router.post("/whitelabel/apply")
async def apply_for_partnership(application: PartnerApplication, db: Session = Depends(get_db)):
    """Apply to become a white label partner"""
    
    # Check if email already exists
    existing_application = db.query(User).filter(
        User.email == application.email,
        User.user_type == "partner"
    ).first()
    
    if existing_application:
        raise HTTPException(
            status_code=400,
            detail="Application already exists for this email"
        )
    
    # In a real implementation, save to database
    # For now, return success response
    
    return {
        "message": "Partnership application submitted successfully",
        "application_id": f"APP-{datetime.now().strftime('%Y%m%d')}-{application.email.split('@')[0]}",
        "next_steps": [
            "Review within 48 hours",
            "Strategy call scheduled if approved",
            "Platform setup within 1 week"
        ]
    }

@router.get("/whitelabel/partners", response_model=List[PartnerProfile])
async def get_all_partners(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all white label partners (admin only)"""
    
    if current_user.user_type != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    
    # Mock data - in real implementation, query database
    partners = [
        PartnerProfile(
            id=1,
            name="Sarah Johnson",
            brand_name="Smart Money Coach",
            custom_domain="sarah.wealthtracker.com",
            branded_colors={"primary": "#FF6B6B", "secondary": "#4ECDC4"},
            logo_url="https://example.com/sarah-logo.png",
            welcome_message="Welcome to your financial transformation journey!",
            status="active",
            created_at=datetime.now() - timedelta(days=30),
            total_users=156,
            monthly_revenue=326.44,
            conversion_rate=0.08
        ),
        PartnerProfile(
            id=2,
            name="Mike Chen",
            brand_name="Wealth Builder Pro",
            custom_domain="mike.wealthtracker.com",
            branded_colors={"primary": "#1A73E8", "secondary": "#34A853"},
            logo_url="https://example.com/mike-logo.png",
            welcome_message="Let's build your wealth together!",
            status="active",
            created_at=datetime.now() - timedelta(days=60),
            total_users=289,
            monthly_revenue=604.31,
            conversion_rate=0.12
        )
    ]
    
    return partners

@router.get("/whitelabel/partner/{partner_id}/revenue", response_model=List[RevenueReport])
async def get_partner_revenue(
    partner_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get revenue report for a specific partner"""
    
    if current_user.user_type not in ["admin", "partner"]:
        raise HTTPException(
            status_code=403,
            detail="Partner or admin access required"
        )
    
    # Mock data for last 6 months
    reports = []
    for i in range(6):
        month_date = datetime.now() - timedelta(days=30 * i)
        base_users = 150 + (i * 25)
        
        subscription_revenue = base_users * 2.99
        service_revenue = base_users * 0.15 * 50  # 15% use services
        total_revenue = subscription_revenue + service_revenue
        partner_share = (subscription_revenue * 0.7) + (service_revenue * 0.8)
        
        reports.append(RevenueReport(
            month=month_date.strftime("%Y-%m"),
            subscription_revenue=subscription_revenue,
            service_revenue=service_revenue,
            total_revenue=total_revenue,
            partner_share=partner_share,
            total_users=base_users,
            new_users=25,
            churn_rate=0.05,
            services_sold={
                "simple_will": int(base_users * 0.10),
                "complex_will": int(base_users * 0.03),
                "life_insurance": int(base_users * 0.08),
                "financial_advice": int(base_users * 0.15)
            }
        ))
    
    return reports

@router.get("/whitelabel/marketing-materials", response_model=MarketingMaterials)
async def get_marketing_materials(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get marketing materials for white label partners"""
    
    if current_user.user_type not in ["admin", "partner"]:
        raise HTTPException(
            status_code=403,
            detail="Partner access required"
        )
    
    materials = MarketingMaterials(
        email_templates=[
            {
                "subject": "Your Financial Journey Starts Here",
                "body": "Hi {name},\n\nI'm excited to share something I've been working on just for you...\n\nIntroducing {brand_name} - your personal wealth tracker that gives you the same tools I use to manage my own finances.\n\nFor just £2.99/month, you'll get:\n✓ Complete wealth tracking\n✓ Professional financial reports\n✓ Goal setting and progress tracking\n✓ My personal guidance and tips\n\nReady to take control of your financial future?\n\n[Start Your Free Trial]\n\nTo your success,\n{coach_name}"
            },
            {
                "subject": "Free Financial Health Check Inside",
                "body": "Hi {name},\n\nWant to know exactly where you stand financially?\n\nI've created a free financial health check that will:\n• Calculate your true net worth\n• Show your emergency fund status\n• Identify your biggest opportunities\n• Give you a personalized action plan\n\nThis usually costs £200 with a financial advisor, but it's completely free for my community.\n\n[Get Your Free Health Check]\n\nTalk soon,\n{coach_name}"
            }
        ],
        social_media_posts=[
            {
                "platform": "Instagram",
                "content": "💰 The tool that changed my financial life is now available to you!\n\nAfter months of development, I'm thrilled to share my personal wealth tracker with my community.\n\nFor less than a coffee per month, you get:\n✨ Professional-grade wealth tracking\n✨ Beautiful financial reports\n✨ Goal tracking and progress visualization\n✨ My personal tips and guidance\n\nLink in bio for your free trial! 👆\n\n#WealthBuilding #FinancialFreedom #MoneyManagement"
            },
            {
                "platform": "LinkedIn",
                "content": "After helping hundreds of people improve their finances, I noticed one common problem:\n\nMost people don't know their true financial picture.\n\nThat's why I created a comprehensive wealth tracking platform for my community.\n\nIt's the same system I use personally, now available for just £2.99/month.\n\nInterested in taking control of your finances? Comment 'WEALTH' and I'll send you the details."
            },
            {
                "platform": "TikTok",
                "content": "POV: You finally know exactly where your money is going 💸\n\nThis is the wealth tracker I built for my community and it's a game-changer!\n\n✅ Tracks ALL your accounts\n✅ Shows your real net worth\n✅ Creates professional reports\n✅ Costs less than a coffee\n\nLink in bio to try it free! ☕→💰\n\n#FinTok #WealthTracker #MoneyTips"
            }
        ],
        landing_page_copy="""
        # Welcome to {brand_name}
        ## Your Personal Wealth Management Platform
        
        Finally, a simple way to track your complete financial picture - created specifically for the {coach_name} community.
        
        ### What You Get:
        - Complete wealth tracking across all accounts
        - Professional financial reports (worth £200+ from advisors)
        - Goal setting and milestone tracking
        - Insurance and estate planning tools
        - Direct access to {coach_name}'s guidance
        
        ### Why I Created This:
        "After years of helping people with their finances, I realized most people don't have a clear picture of their wealth. So I built the tool I wish existed when I started my journey." - {coach_name}
        
        ### Join 500+ Community Members Already Building Wealth
        
        **Special Launch Price: £2.99/month (usually £9.99)**
        
        [Start Your Free 14-Day Trial]
        
        *Cancel anytime. No contracts. Your data is always yours.*
        """,
        video_scripts=[
            "Hey everyone! I'm so excited to share something I've been working on for months. You know how I'm always talking about tracking your wealth and knowing your numbers? Well, I finally built the tool I've been dreaming of. It's called {brand_name} and it's going to change how you think about your money. Let me show you...",
            "Quick question - do you know your exact net worth right now? Not just a rough estimate, but the real number? Most people don't, and that's a problem. That's why I created {brand_name} - to give you the same tools I use personally. Here's how it works...",
            "The biggest mistake I see people make with money? Not tracking it properly. That's why I built {brand_name} - your personal wealth tracker that's like having a financial advisor in your pocket. And the best part? It's less than a coffee per month. Let me show you what's inside..."
        ],
        faq_responses=[
            {
                "question": "Is my financial data secure?",
                "answer": "Absolutely! We use bank-level encryption and never store your banking passwords. Your data is as secure as your online banking."
            },
            {
                "question": "Do I need to connect my bank accounts?",
                "answer": "No! You can enter your information manually. We designed it to be simple and private - you control what you share."
            },
            {
                "question": "What if I don't have much money to track?",
                "answer": "This is perfect for beginners! Even if you're just starting out, tracking your progress is the first step to building wealth."
            },
            {
                "question": "Can I cancel anytime?",
                "answer": "Yes, cancel anytime with no fees. Your data is always yours, and you can export everything if you decide to leave."
            }
        ]
    )
    
    return materials

@router.post("/whitelabel/customize-branding")
async def customize_partner_branding(
    partner_id: int,
    branding: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Customize branding for a white label partner"""
    
    if current_user.user_type not in ["admin", "partner"]:
        raise HTTPException(
            status_code=403,
            detail="Partner access required"
        )
    
    # In real implementation, save branding to database
    # For now, return success response
    
    return {
        "message": "Branding updated successfully",
        "preview_url": f"https://partner-{partner_id}.wealthtracker.com/preview",
        "changes": branding
    }

@router.get("/whitelabel/partner/{partner_id}/analytics")
async def get_partner_analytics(
    partner_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed analytics for a white label partner"""
    
    if current_user.user_type not in ["admin", "partner"]:
        raise HTTPException(
            status_code=403,
            detail="Partner access required"
        )
    
    # Mock analytics data
    return {
        "overview": {
            "total_users": 156,
            "active_users": 142,
            "monthly_revenue": 326.44,
            "conversion_rate": 0.08,
            "churn_rate": 0.05
        },
        "user_growth": [
            {"month": "2025-01", "new_users": 25, "total_users": 156},
            {"month": "2024-12", "new_users": 32, "total_users": 131},
            {"month": "2024-11", "new_users": 28, "total_users": 99}
        ],
        "top_features": [
            {"feature": "Wealth tracking", "usage": 0.95},
            {"feature": "PDF reports", "usage": 0.78},
            {"feature": "Goal setting", "usage": 0.65},
            {"feature": "Insurance planning", "usage": 0.42}
        ],
        "service_conversion": {
            "simple_will": 0.12,
            "complex_will": 0.03,
            "life_insurance": 0.08,
            "financial_advice": 0.15
        }
    }