
# Smart Doctor Connect AI

**An intelligent healthcare platform connecting patients with doctors using AI-powered recommendations and real-time chat.**

> 🏆 MTM AI Hackathon Project

## Overview

Smart Doctor Connect AI is a comprehensive healthcare platform that leverages artificial intelligence to enhance patient-doctor interactions. The platform provides appointment scheduling, AI-powered health recommendations, real-time chat, and an admin dashboard for healthcare management.

## Features

- **AI-Powered Health Recommendations** - Get personalized health advice based on symptoms and medical history
- **Doctor Discovery** - Search and filter doctors by specialty, ratings, and availability
- **Appointment Scheduling** - Book and manage appointments seamlessly
- **Real-time Chat** - Direct messaging between patients and doctors
- **User Authentication** - Secure login for patients, doctors, and administrators
- **Admin Dashboard** - Manage users, appointments, and system configuration
- **Patient Dashboard** - Track appointments, medical history, and recommendations
- **Doctor Dashboard** - Manage schedule, patient consultations, and availability

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 13+
- Docker & Docker Compose (optional)

### Quick Start

#### Option 1: Using Docker Compose
```bash
docker-compose up
```

#### Option 2: Local Setup

**Backend Setup:**
```bash
cd backend
pip install -r requirements.txt
python seed.py  # Initialize database
python -m uvicorn app.main:app --reload
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`


## Development

### Frontend
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview build
```

### Backend
```bash
cd backend
python -m uvicorn app.main:app --reload  # Development server
```

## Database

The project uses PostgreSQL. Initial schema is created automatically on first run. Use `backend/seed.py` to populate sample data.

## Environment Variables

Create `.env` files for each component:

**Backend (.env):**
```
DATABASE_URL=postgresql://user:password@localhost/smartdoctor
JWT_SECRET=your_secret_key
AI_API_KEY=your_api_key
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000/api
```


