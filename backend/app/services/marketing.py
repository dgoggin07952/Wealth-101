"""
Marketing and business intelligence services
"""
from typing import List, Dict, Any
from datetime import datetime, timedelta
import json

class MarketingInsights:
    """Generate insights for business growth and marketing"""
    
    @staticmethod
    def calculate_user_lifetime_value(user_wealth: float, months_active: int) -> float:
        """Calculate potential user lifetime value for subscription pricing"""
        # Basic LTV calculation based on wealth managed
        base_monthly_fee = min(user_wealth * 0.001, 100)  # 0.1% of wealth, capped at £100
        return base_monthly_fee * max(months_active, 12)  # Minimum 12 months
    
    @staticmethod
    def get_pricing_recommendations(user_wealth_segments: Dict[str, List[float]]) -> Dict[str, Any]:
        """Recommend pricing tiers based on simplified flat pricing model"""
        
        pricing_structure = {
            "subscription": {
                "monthly_price": 2.99,
                "annual_price": 29.99,
                "features": ["Complete wealth tracking", "All reports", "PDF downloads", "Mobile app", "Email support"],
                "target_segment": "All users - simple, affordable pricing"
            },
            "services": {
                "simple_will": {
                    "price": 50.00,
                    "description": "Basic will creation service",
                    "target_segment": "Users without estate planning"
                },
                "complex_will": {
                    "price": 150.00,
                    "description": "Complex will with trust arrangements",
                    "target_segment": "High net worth users"
                },
                "life_insurance": {
                    "price": 100.00,
                    "description": "Life insurance consultation and setup",
                    "target_segment": "Users with dependents"
                },
                "financial_advice_referral": {
                    "price": 50.00,
                    "description": "Referral fee for connecting users to financial advisors",
                    "target_segment": "Users seeking professional guidance"
                }
            }
        }
        
        return pricing_structure
    
    @staticmethod
    def generate_user_segments(users_data: List[Dict]) -> Dict[str, List[Dict]]:
        """Segment users for targeted marketing"""
        
        segments = {
            "high_value": [],      # High wealth, active users
            "growth_potential": [], # Medium wealth, growing fast
            "at_risk": [],         # Inactive or declining wealth
            "new_users": []        # Recently joined
        }
        
        for user in users_data:
            wealth = user.get('total_wealth', 0)
            days_since_created = (datetime.now() - user.get('created_at', datetime.now())).days
            
            if wealth > 500000:
                segments["high_value"].append(user)
            elif wealth > 50000 and days_since_created < 90:
                segments["growth_potential"].append(user)
            elif days_since_created < 30:
                segments["new_users"].append(user)
            else:
                segments["at_risk"].append(user)
        
        return segments
    
    @staticmethod
    def get_marketing_campaigns() -> List[Dict[str, Any]]:
        """Suggest marketing campaigns based on user segments"""
        
        campaigns = [
            {
                "name": "New User Onboarding",
                "target_segment": "new_users",
                "type": "email_sequence",
                "messages": [
                    "Welcome to WealthTracker Pro - Get started in 5 minutes",
                    "Your first wealth report is ready - See your financial snapshot",
                    "Tip: Set your first financial goal and track progress"
                ],
                "timing": "Day 1, 3, 7 after signup"
            },
            {
                "name": "Premium Upgrade Campaign",
                "target_segment": "growth_potential",
                "type": "targeted_offer",
                "messages": [
                    "Your wealth is growing fast! Unlock advanced features with 30% off Premium",
                    "See what successful investors track - Premium features preview"
                ],
                "timing": "When wealth increases by 20%+"
            },
            {
                "name": "Re-engagement Campaign",
                "target_segment": "at_risk",
                "type": "win_back",
                "messages": [
                    "We miss you! Your financial goals are waiting",
                    "New features you'll love - PDF reports, mobile app, and more"
                ],
                "timing": "After 30 days of inactivity"
            }
        ]
        
        return campaigns
    
    @staticmethod
    def calculate_conversion_metrics(user_data: List[Dict]) -> Dict[str, Any]:
        """Calculate key business metrics for tracking growth"""
        
        total_users = len(user_data)
        active_users = len([u for u in user_data if u.get('is_active', False)])
        
        # Simulate conversion rates (in real app, track actual conversions)
        conversion_rates = {
            "visitor_to_signup": 0.15,  # 15% of visitors sign up
            "trial_to_paid": 0.25,      # 25% of trial users convert to paid
            "monthly_to_annual": 0.35,   # 35% upgrade to annual plans
            "churn_rate": 0.05          # 5% monthly churn rate
        }
        
        # Calculate revenue potential with new pricing model
        avg_wealth = sum(u.get('total_wealth', 0) for u in user_data) / max(total_users, 1)
        
        # Base subscription revenue
        subscription_revenue = total_users * 2.99
        
        # Service revenue estimates (based on conversion rates)
        service_revenue = (
            total_users * 0.15 * 50 +    # 15% use simple will service
            total_users * 0.05 * 150 +   # 5% use complex will service
            total_users * 0.10 * 100 +   # 10% use life insurance service
            total_users * 0.20 * 50      # 20% referred to financial advisors
        )
        
        estimated_monthly_revenue = subscription_revenue + (service_revenue / 12)  # Service revenue spread over year
        
        return {
            "total_users": total_users,
            "active_users": active_users,
            "activation_rate": active_users / max(total_users, 1),
            "avg_wealth_per_user": avg_wealth,
            "estimated_monthly_revenue": estimated_monthly_revenue,
            "conversion_rates": conversion_rates,
            "growth_rate": 0.12  # 12% monthly growth target
        }