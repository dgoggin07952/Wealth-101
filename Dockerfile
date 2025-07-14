FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync --frozen

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONPATH=/app/backend
ENV PORT=5000

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "main.py"]