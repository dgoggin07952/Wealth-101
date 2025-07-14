# Deployment Guide - WealthTracker Pro

## Quick Start

### 1. Environment Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/wealthtracker-pro.git
cd wealthtracker-pro

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 2. Backend Deployment
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://user:password@localhost/wealthtracker"
export JWT_SECRET_KEY="your-secure-secret-key"

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 3. Frontend Deployment
```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Serve the built files
npm run preview
```

## Production Deployments

### Replit Deployment
1. Import the GitHub repository to Replit
2. Set environment variables in Replit Secrets
3. Use the configured `.replit` file
4. Deploy using Replit Deployments

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individual containers
docker build -t wealthtracker-backend ./backend
docker build -t wealthtracker-frontend ./frontend
```

### AWS Deployment
1. **Backend**: Deploy to AWS Lambda or EC2
2. **Frontend**: Deploy to AWS S3 + CloudFront
3. **Database**: Use AWS RDS PostgreSQL
4. **Environment**: Set variables in AWS Systems Manager

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Deploy backend (serverless functions)
cd backend
vercel --prod
```

## Environment Variables

### Required Variables
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET_KEY=your-super-secure-secret-key
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Optional Variables
```env
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
ADMIN_EMAIL=admin@yourdomain.com
SENDGRID_API_KEY=your-sendgrid-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

## Security Checklist

- [ ] Change default JWT secret key
- [ ] Configure CORS origins for production
- [ ] Set up rate limiting
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Set up error tracking (Sentry, etc.)

## Performance Optimization

### Backend
- Use connection pooling for database
- Implement caching (Redis)
- Enable compression middleware
- Use async/await properly
- Optimize database queries

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement code splitting
- Optimize images and assets
- Use service workers for caching

## Monitoring and Maintenance

### Health Checks
- Backend health endpoint: `/health`
- Database connection monitoring
- API response time tracking
- Error rate monitoring

### Logging
- Application logs
- Access logs
- Error logs
- Audit logs for financial data

### Backups
- Daily database backups
- User data export functionality
- Configuration backups
- Code repository backups

## Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Database read replicas
- CDN for static assets
- Microservices architecture

### Vertical Scaling
- CPU and memory optimization
- Database performance tuning
- Caching strategies
- Asset optimization

## Support and Troubleshooting

### Common Issues
1. **Database Connection**: Check DATABASE_URL format
2. **CORS Errors**: Verify CORS_ORIGINS setting
3. **JWT Issues**: Ensure JWT_SECRET_KEY is set
4. **Build Failures**: Check Node.js and Python versions

### Debug Commands
```bash
# Check backend logs
tail -f backend/logs/app.log

# Check frontend build
cd frontend && npm run build

# Test database connection
python -c "from backend.app.models import get_db; print('DB OK')"

# Test API endpoints
curl -X GET http://localhost:8000/health
```

## Business Deployment

### White Label Setup
1. Update branding colors in `frontend/src/styles`
2. Replace logo and favicon
3. Update company information
4. Configure custom domain
5. Set up payment processing

### Multi-tenant Configuration
- Separate databases per client
- Custom subdomains
- Branded email templates
- Client-specific features

---

For additional support, refer to the main documentation in `replit.md` or create an issue in the GitHub repository.