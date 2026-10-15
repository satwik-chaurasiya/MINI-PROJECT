FROM python:3.10-slim

WORKDIR /app

# Install build dependencies for C++ extensions (needed by prophet/pystan)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./backend/requirements.txt
COPY ml_engine/requirements.txt ./ml_engine/requirements.txt

RUN pip install --no-cache-dir -r backend/requirements.txt
RUN pip install --no-cache-dir -r ml_engine/requirements.txt

COPY backend/ ./backend/
COPY ml_engine/ ./ml_engine/

WORKDIR /app/backend

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]