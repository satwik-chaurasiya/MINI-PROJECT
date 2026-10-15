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
    from app.models import User, Alert, Product, PlatformListing
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        try:
            res = conn.execute(text("PRAGMA table_info(alerts)")).fetchall()
            existing_cols = [r[1] for r in res]
            if "platform" not in existing_cols:
                conn.execute(text("ALTER TABLE alerts ADD COLUMN platform VARCHAR DEFAULT 'Amazon'"))
            if "current_price" not in existing_cols:
                conn.execute(text("ALTER TABLE alerts ADD COLUMN current_price FLOAT DEFAULT 0.0"))
            if "store_url" not in existing_cols:
                conn.execute(text("ALTER TABLE alerts ADD COLUMN store_url VARCHAR"))
            conn.commit()
        except Exception as e:
            print(f"Migration notice: {e}")
