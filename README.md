# WealthTracker Pro

A comprehensive wealth management platform that transforms financial data into actionable insights through advanced visualization and user-centric design.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication system
- **Dashboard**: Interactive financial overview with real-time analytics
- **Asset Management**: Track stocks, real estate, cash, retirement accounts, and business assets
- **Income & Expense Tracking**: Comprehensive transaction monitoring
- **Insurance Planning**: Percentage-based protection gap analysis
- **Financial Goals**: Milestone setting and progress tracking
- **PDF Reports**: Professional financial reports with modern design

### Advanced Features
- **Financial Freedom Score**: 0-1000 scale financial health indicator
- **Action Items System**: 16-item comprehensive financial planning checklist
- **Admin Dashboard**: Business owner portal with user analytics
- **Missing Expense Detection**: Smart suggestions for common UK expenses
- **Mobile-First Design**: Responsive interface optimized for all devices

## 🛠️ Tech Stack

### Frontend
- **React 18+** with modern hooks
- **Tailwind CSS** for styling
- **Vite** for build system
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API communication

### Backend
- **FastAPI** with async/await
- **SQLAlchemy** ORM with PostgreSQL
- **JWT Authentication** with bcrypt
- **Pydantic** for data validation
- **ReportLab** for PDF generation
- **Uvicorn** ASGI server

### Database
- **PostgreSQL** with environment-based configuration
- **SQLAlchemy** models with proper relationships
- **Alembic** for database migrations

## 📋 Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL database

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
# or with poetry
poetry install

# Set environment variables
export DATABASE_URL="postgresql://user:password@localhost/wealthtracker"
export JWT_SECRET_KEY="your-secret-key"

# Run migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Configuration

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost/wealthtracker
JWT_SECRET_KEY=your-jwt-secret-key
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Database Setup
The application uses PostgreSQL. Ensure your database is running and accessible via the DATABASE_URL.

## 🏗️ Architecture

### Project Structure
```
wealthtracker-pro/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── models.py     # Database models
│   │   └── main.py       # FastAPI application
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── main.jsx      # Application entry
│   ├── package.json
│   └── vite.config.js
└── README.md
```

### Key Components
- **Authentication System**: JWT-based with secure password hashing
- **Dashboard**: Real-time financial analytics and insights
- **Asset Management**: Comprehensive tracking with categorization
- **Financial Health**: Scoring system with improvement recommendations
- **PDF Generation**: Professional reports with branded design

## 📊 Business Model

- **Subscription**: £2.99/month flat rate
- **Target Market**: Financial wellness coach influencers
- **White Label**: Partnership opportunities available
- **Service Fees**: Additional revenue from will creation, insurance, and financial advice referrals

## 🚀 Deployment

### Production Deployment
The application is configured for deployment on various platforms:

1. **Replit**: Currently optimized and tested
2. **Docker**: Containerized deployment ready
3. **Cloud Platforms**: AWS, GCP, Azure compatible
4. **Traditional Hosting**: VPS with reverse proxy

### Security Features
- Rate limiting (100 requests/minute per IP)
- CORS protection with domain restrictions
- JWT token security with auto-generated keys
- Input validation and sanitization
- SQL injection prevention through ORM

## 📈 Key Metrics

### Financial Health Scoring
- **Emergency Fund**: 6-month expense coverage
- **Income vs Expenses**: 25% disposable income target
- **Insurance Coverage**: Percentage-based protection gap
- **Asset Diversification**: Multi-category portfolio analysis
- **Estate Planning**: Will and succession planning status

### User Analytics
- Total users and active user tracking
- Wealth management trends
- User segmentation (high-value, growth-potential, at-risk)
- Performance monitoring and optimization

## 🔐 Security

- **Authentication**: JWT tokens with secure expiration
- **Password Security**: bcrypt hashing with salt
- **API Protection**: Rate limiting and CORS policies
- **Data Validation**: Pydantic models for input sanitization
- **Database Security**: ORM prevents SQL injection

## 📱 Mobile Optimization

- Mobile-first responsive design
- Touch-friendly interface elements
- Optimized PDF downloads for mobile devices
- Bottom navigation for easy thumb access
- Swipe gestures for horizontal scrollers

## 🎨 Design System

- **Dark Theme**: Modern black (#0f172a) and pink (#ec4899) palette
- **Glassmorphism**: Translucent cards with blur effects
- **Smooth Animations**: Hover effects and transitions
- **Consistent Typography**: Professional font hierarchy
- **Visual Hierarchy**: Clear information structure

## 📚 API Documentation

The FastAPI backend provides automatic API documentation:
- **Swagger UI**: Available at `/docs`
- **ReDoc**: Available at `/redoc`
- **OpenAPI Schema**: Available at `/openapi.json`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in `replit.md`

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics and AI insights
- [ ] Integration with banking APIs
- [ ] Multi-currency support
- [ ] Advanced estate planning tools
- [ ] Social features and community
- [ ] Cryptocurrency tracking
- [ ] Advanced tax optimization

---

**WealthTracker Pro** - Transforming financial data into actionable insights for wealth management and financial wellness.