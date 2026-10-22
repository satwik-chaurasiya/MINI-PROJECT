from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    reset_token = Column(String, nullable=True)
    reset_token_expiry = Column(DateTime, nullable=True)
    has_completed_onboarding = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    alerts = relationship("Alert", back_populates="user", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    category = Column(String, default="Electronics")
    platform = Column(String, default="Amazon", index=True) # Amazon, Flipkart, Walmart, eBay
    current_price = Column(Float, nullable=False)
    predicted_low = Column(Float)
    predicted_date = Column(String)
    savings_percentage = Column(Float, default=0.0)
    confidence_score = Column(Integer, default=95)
    verdict = Column(String, default="BUY NOW")
    image_url = Column(String)
    store_url = Column(String)
    updated_at = Column(DateTime, default=datetime.utcnow)

    listings = relationship("PlatformListing", back_populates="product", cascade="all, delete-orphan")

class PlatformListing(Base):
    __tablename__ = "platform_listings"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String, ForeignKey("products.id"), nullable=True, index=True)
    product_name = Column(String, index=True)
    platform = Column(String, index=True, nullable=False) # Amazon, Flipkart, Walmart, eBay
    price = Column(Float, nullable=False)
    store_url = Column(String)
    image_url = Column(String)
    scraped_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="listings")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(String, index=True)
    product_name = Column(String)
    platform = Column(String, default="Amazon", index=True) # Amazon, Flipkart, Walmart, eBay
    current_price = Column(Float, default=0.0)
    target_price = Column(Float)
    store_url = Column(String)
    notify_method = Column(String, default="Email")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="alerts")

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, index=True, nullable=False) # pageview, search, compare, alert_created, click_store
    path = Column(String, nullable=True)
    user_id = Column(Integer, nullable=True)
    metadata_json = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AuditErrorLog(Base):
    __tablename__ = "audit_error_logs"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String, index=True, default="backend") # frontend, backend
    error_message = Column(Text, nullable=False)
    stack_trace = Column(Text, nullable=True)
    path = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

