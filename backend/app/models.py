"""
Database models for WealthTracker Pro - Migrated from Streamlit version
"""
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from datetime import datetime, date
import os

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/wealthtracker")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    """User model with authentication and personal information"""
    __tablename__ = 'users'
    
    # Primary key and authentication
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    user_type = Column(String(50), default='client')
    is_active = Column(Boolean, default=True)
    
    # Personal information
    name = Column(String(255), default='New User')
    home_country = Column(String(100), default='United Kingdom')
    home_currency = Column(String(10), default='GBP')
    date_of_birth = Column(Date)
    phone_number = Column(String(50))
    address = Column(Text)
    national_insurance_number = Column(String(50))
    
    # Emergency contacts
    emergency_contact_name = Column(String(255))
    emergency_contact_phone = Column(String(50))
    emergency_contact_relationship = Column(String(100))
    
    # Professional contacts
    solicitor_name = Column(String(255))
    solicitor_phone = Column(String(50))
    solicitor_email = Column(String(255))
    accountant_name = Column(String(255))
    accountant_phone = Column(String(50))
    accountant_email = Column(String(255))
    financial_advisor_name = Column(String(255))
    financial_advisor_phone = Column(String(50))
    financial_advisor_email = Column(String(255))
    
    # Legal documents
    will_location = Column(Text)
    power_of_attorney_location = Column(Text)
    insurance_policies = Column(Text)
    additional_notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class WealthRecord(Base):
    """Historical wealth tracking records"""
    __tablename__ = 'wealth_records'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)  # Foreign key to users
    date = Column(Date, index=True, nullable=False)
    cash_savings = Column(Float, default=0.0)
    stocks_securities = Column(Float, default=0.0)
    real_estate = Column(Float, default=0.0)
    retirement_accounts = Column(Float, default=0.0)
    business_assets = Column(Float, default=0.0)
    other_investments = Column(Float, default=0.0)
    total_wealth = Column(Float, nullable=False)
    notes = Column(Text, default='')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AssetDetail(Base):
    """Individual asset details with ownership information"""
    __tablename__ = 'asset_details'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)  # Foreign key to users
    wealth_record_id = Column(Integer, nullable=False)  # Foreign key to wealth_records
    asset_name = Column(String(255), nullable=False)
    asset_category = Column(String(100), nullable=False)
    asset_type = Column(String(100), nullable=False)
    ownership_type = Column(String(50), nullable=False)
    value = Column(Float, nullable=False)
    description = Column(Text, default='')
    company_name = Column(String(255))
    
    # Banking details
    bank_name = Column(String(100))
    account_number = Column(String(50))
    account_type = Column(String(50))
    interest_rate = Column(Float)
    
    # Property details
    property_address = Column(Text)
    property_type = Column(String(100))
    purchase_price = Column(Float)
    purchase_date = Column(Date)
    mortgage_balance = Column(Float)
    mortgage_rate = Column(Float)
    monthly_payment = Column(Float)
    mortgage_term = Column(Integer)
    mortgage_lender = Column(String(100))
    mortgage_payment_type = Column(String(50))
    
    # Investment details
    investment_name = Column(String(255))
    investment_type = Column(String(100))
    broker = Column(String(100))
    shares_quantity = Column(Float)
    purchase_price_per_share = Column(Float)
    dividend_yield = Column(Float)
    
    # Business details
    business_name = Column(String(255))
    ownership_percentage = Column(Float)
    business_type = Column(String(100))
    annual_revenue = Column(Float)
    
    # Retirement account details
    retirement_account_type = Column(String(100))
    provider = Column(String(100))
    contribution_limit = Column(Float)
    
    # Cryptocurrency details
    crypto_name = Column(String(100))
    crypto_symbol = Column(String(20))
    quantity = Column(Float)
    wallet_exchange = Column(String(100))
    
    # Personal items
    item_name = Column(String(255))
    category = Column(String(100))
    appraisal_date = Column(Date)
    appraiser = Column(String(255))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class IncomeRecord(Base):
    """Income tracking records"""
    __tablename__ = 'income_records'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    income_name = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    income_date = Column(Date, nullable=False)
    category = Column(String(100), nullable=False)
    frequency = Column(String(50), default='One-time')
    tax_status = Column(String(50), default='Taxable')
    description = Column(Text, default='')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ExpenseRecord(Base):
    """Expense tracking records"""
    __tablename__ = 'expense_records'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    expense_name = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    expense_date = Column(Date, nullable=False)
    category = Column(String(100), nullable=False)
    frequency = Column(String(50), default='One-time')
    payment_method = Column(String(50), default='Cash')
    description = Column(Text, default='')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Milestone(Base):
    """Financial milestones and goals"""
    __tablename__ = 'milestones'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, default='')
    category = Column(String(100), nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    target_date = Column(Date, nullable=False)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class InsurancePolicy(Base):
    """Insurance policy tracking"""
    __tablename__ = 'insurance_policies'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    policy_type = Column(String(50), nullable=False)  # income, inheritance, family
    provider = Column(String(255), nullable=False)
    coverage_amount = Column(Float, nullable=False)  # Monthly payout for income/family, lump sum for inheritance
    monthly_premium = Column(Float, nullable=False)
    policy_number = Column(String(100))
    start_date = Column(Date)
    end_date = Column(Date)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Database session dependency
def get_db():
    """Get database session for dependency injection"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)