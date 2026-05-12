# Smart Doctor Connect AI - FastAPI Backend

Complete FastAPI backend for the Smart Doctor Connect AI healthcare platform.

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── database/
│   │   ├── config.py        # Database configuration & session management
│   │   └── models.py        # SQLAlchemy ORM models
│   ├── routes/
│   │   ├── auth.py          # Authentication endpoints (login, register)
│   │   ├── doctors.py       # Doctor profile & search endpoints
│   │   ├── appointments.py  # Appointment booking & management
│   │   ├── chat.py          # Chat/messaging endpoints
│   │   └── admin.py         # Admin dashboard endpoints
│   ├── schemas/
│   │   └── schemas.py       # Pydantic models for request/response validation
│   └── utils/
│       ├── jwt_handler.py   # JWT token creation & validation
│       ├── password_handler.py  # Password hashing & verification
│       └── ai_recommendations.py # AI doctor recommendation engine
├── requirements.txt         # Python dependencies
├── .env.example            # Example environment variables
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- pip or conda
- PostgreSQL (or SQLite for development)

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Setup environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Run the server:**
```bash
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the server is running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new patient
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout user

### Doctors
- `GET /api/v1/doctors/` - List doctors (with filters)
- `GET /api/v1/doctors/{id}` - Get doctor details
- `GET /api/v1/doctors/{id}/reviews` - Get doctor reviews
- `GET /api/v1/doctors/{id}/available-slots` - Get available slots
- `GET /api/v1/doctors/search/symptoms` - AI-powered search by symptoms

### Appointments
- `POST /api/v1/appointments/` - Book appointment
- `GET /api/v1/appointments/` - Get patient appointments
- `GET /api/v1/appointments/{id}` - Get appointment details
- `PUT /api/v1/appointments/{id}` - Update appointment
- `DELETE /api/v1/appointments/{id}` - Cancel appointment

### Chat
- `POST /api/v1/chat/send` - Send message
- `GET /api/v1/chat/history/{doctor_id}` - Get chat history
- `GET /api/v1/chat/list` - Get chat list
- `PUT /api/v1/chat/mark-as-read/{doctor_id}` - Mark messages as read
- `WebSocket /api/v1/chat/ws/{doctor_id}/{patient_id}` - Real-time chat

### Admin
- `GET /api/v1/admin/stats` - Get dashboard statistics
- `GET /api/v1/admin/doctors/pending-verification` - Get pending doctors
- `PUT /api/v1/admin/doctors/{id}/verify` - Verify doctor
- `DELETE /api/v1/admin/doctors/{id}/reject` - Reject doctor
- `GET /api/v1/admin/appointments` - Get all appointments
- `GET /api/v1/admin/users` - Get all users

## 🗄️ Database Setup

### PostgreSQL
```bash
# Create database
createdb smart_doctor_connect

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://username:password@localhost:5432/smart_doctor_connect
```

### SQLite (Development)
Already configured in .env.example for development:
```
DATABASE_URL=sqlite:///./smart_doctor_connect.db
```

### Run migrations (if using Alembic)
```bash
alembic upgrade head
```

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ CORS middleware
- ✅ Input validation with Pydantic
- ✅ SQL injection prevention with SQLAlchemy ORM

## 🤖 AI Features

### Doctor Recommendation Engine
The system includes intelligent symptom-to-specialization mapping that:
- Analyzes patient symptoms
- Maps to appropriate medical specializations
- Recommends best-matched doctors by rating
- Provides confidence scores

**Example:**
```python
symptoms = "I have chest pain and shortness of breath"
# Returns: Cardiologist (95%), General Physician (80%)
```

## 📦 Technologies Used

- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL / SQLite
- **Authentication**: JWT + Bcrypt
- **Validation**: Pydantic
- **Server**: Uvicorn
- **Real-time**: WebSocket support

## 🔄 Integration with Frontend

### CORS Configuration
Update `.env` to allow your frontend domain:
```
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

### Example API Call from React
```javascript
const response = await fetch('http://localhost:8000/api/v1/doctors/', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🚧 Future Enhancements

- [ ] Real-time messaging with WebSocket
- [ ] Payment gateway integration (Stripe)
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced ML-based recommendations
- [ ] Video consultation support
- [ ] Prescription management
- [ ] Medical records storage
- [ ] Analytics dashboard
- [ ] Multi-language support

## 🛠️ Development

### Run tests
```bash
pytest
```

### Format code
```bash
black app/
flake8 app/
```

### Create new migration
```bash
alembic revision --autogenerate -m "description"
```

## 📝 Environment Variables

See `.env.example` for complete list. Key variables:

- `DATABASE_URL` - Database connection string
- `SECRET_KEY` - JWT secret key
- `DEBUG` - Debug mode (True/False)
- `BACKEND_CORS_ORIGINS` - Allowed CORS origins
- `SMTP_SERVER` - Email server for notifications
- `STRIPE_API_KEY` - Payment processing

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of Smart Doctor Connect AI

## 👨‍💻 Support

For issues or questions, please contact the development team.
