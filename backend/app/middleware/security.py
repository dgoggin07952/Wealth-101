"""
Security middleware for production deployment
"""
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import time
from collections import defaultdict
import threading

class SecurityMiddleware(BaseHTTPMiddleware):
    """Enhanced security middleware with rate limiting and security headers"""
    
    def __init__(self, app, calls_per_minute: int = 100):
        super().__init__(app)
        self.calls_per_minute = calls_per_minute
        self.requests = defaultdict(list)
        self.lock = threading.Lock()
    
    async def dispatch(self, request: Request, call_next) -> Response:
        # Rate limiting
        client_ip = request.client.host
        current_time = time.time()
        
        with self.lock:
            # Clean old requests
            self.requests[client_ip] = [
                req_time for req_time in self.requests[client_ip]
                if current_time - req_time < 60  # Last minute
            ]
            
            # Check rate limit
            if len(self.requests[client_ip]) >= self.calls_per_minute:
                raise HTTPException(
                    status_code=429,
                    detail="Rate limit exceeded. Please try again later."
                )
            
            # Record this request
            self.requests[client_ip].append(current_time)
        
        # Process request
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
        
        return response