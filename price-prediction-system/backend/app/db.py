import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "pricespy.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    # Ensure all models are imported and registered with Base.metadata
    from app.models import User, Alert, Product, PlatformListing, AnalyticsEvent, AuditErrorLog
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        try:
            # Alerts migrations
            res = conn.execute(text("PRAGMA table_info(alerts)")).fetchall()
            existing_cols = [r[1] for r in res]
            if "platform" not in existing_cols:
                conn.execute(text("ALTER TABLE alerts ADD COLUMN platform VARCHAR DEFAULT 'Amazon'"))
            if "current_price" not in existing_cols:
                conn.execute(text("ALTER TABLE alerts ADD COLUMN current_price FLOAT DEFAULT 0.0"))
            if "store_url" not in existing_cols:
                conn.execute(text("ALTER TABLE alerts ADD COLUMN store_url VARCHAR"))

            # Users migrations
            res_user = conn.execute(text("PRAGMA table_info(users)")).fetchall()
            user_cols = [r[1] for r in res_user]
            if "is_verified" not in user_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 0"))
            if "verification_token" not in user_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN verification_token VARCHAR"))
            if "reset_token" not in user_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR"))
            if "reset_token_expiry" not in user_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN reset_token_expiry TIMESTAMP"))
            if "has_completed_onboarding" not in user_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN has_completed_onboarding BOOLEAN DEFAULT 0"))
            if "created_at" not in user_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN created_at TIMESTAMP"))

            conn.commit()
        except Exception as e:
            print(f"Migration notice: {e}")

