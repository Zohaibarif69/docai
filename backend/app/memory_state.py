"""
In-memory state management for temporary user storage
Stores users in memory during the application session
"""

from typing import Dict, Optional
from app.utils.password_handler import hash_password

# In-memory user storage
users_db: Dict[str, dict] = {}
doctors_db: Dict[str, dict] = {}

# Test data
TEST_USERS = {
    "patient@test.com": {
        "id": 1,
        "email": "patient@test.com",
        "full_name": "Zohaib Ahmed",
        "phone": "+92 300 1234567",
        "password_hash": None,  # Will be set on init
        "is_active": True,
        "is_verified": True,
        "role": "patient"
    },
    "doctor1@test.com": {
        "id": 2,
        "email": "doctor1@test.com",
        "full_name": "Dr. Farhan Khan",
        "phone": "+92 311 5678901",
        "password_hash": None,
        "is_active": True,
        "is_verified": True,
        "role": "doctor"
    },
    "doctor2@test.com": {
        "id": 3,
        "email": "doctor2@test.com",
        "full_name": "Dr. Amira Hassan",
        "phone": "+92 333 2468013",
        "password_hash": None,
        "is_active": True,
        "is_verified": True,
        "role": "doctor"
    },
}

TEST_DOCTORS = {
    "d1": {
        "id": "d1",
        "name": "Dr. Farhan Khan",
        "specialization": "Cardiologist",
        "city": "Lahore",
        "rating": 4.9,
        "experience_years": 14,
        "review_count": 312,
        "is_online": True,
        "consultation_fee": 2500,
        "image": "https://images.unsplash.com/photo-1615177393114-bd2917a4f74a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "verified": True,
        "hospital": "Lahore Heart Center",
        "education": "MBBS, FCPS (Cardiology) – King Edward Medical University",
        "languages": ["Urdu", "English", "Punjabi"],
    },
    "d2": {
        "id": "d2",
        "name": "Dr. Amira Hassan",
        "specialization": "Dermatologist",
        "city": "Karachi",
        "rating": 4.7,
        "experience_years": 9,
        "review_count": 218,
        "is_online": True,
        "consultation_fee": 2000,
        "image": "https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "verified": True,
        "hospital": "Karachi Skin Clinic",
        "education": "MBBS, FCPS (Dermatology)",
        "languages": ["Urdu", "English"],
    },
    "d3": {
        "id": "d3",
        "name": "Dr. Rashid Malik",
        "specialization": "Orthopedic Surgeon",
        "city": "Islamabad",
        "rating": 4.8,
        "experience_years": 11,
        "review_count": 245,
        "is_online": False,
        "consultation_fee": 2800,
        "image": "https://images.unsplash.com/photo-1769072610024-5b8a50f05c73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        "verified": True,
        "hospital": "Islamabad Orthopedic Center",
        "education": "MBBS, FCPS (Orthopedics)",
        "languages": ["Urdu", "English"],
    },
}

def init_memory_state():
    """Initialize in-memory state with test data"""
    global users_db, doctors_db
    
    # Initialize users with hashed passwords
    for email, user_data in TEST_USERS.items():
        user_copy = user_data.copy()
        user_copy["password_hash"] = hash_password("password123")
        users_db[email] = user_copy
    
    # Initialize doctors
    doctors_db = TEST_DOCTORS.copy()
    
    print("[INFO] In-memory state initialized with test data")
    return True

def get_user_by_email(email: str) -> Optional[dict]:
    """Get user by email from memory"""
    return users_db.get(email)

def get_all_users_dict() -> Dict[str, dict]:
    """Get all users dictionary from memory"""
    return users_db.copy()

def create_user(email: str, full_name: str, phone: str, password: str, role: str = "patient") -> dict:
    """Create new user in memory"""
    if email in users_db:
        return None
    
    user_id = len(users_db) + 1
    user = {
        "id": user_id,
        "email": email,
        "full_name": full_name,
        "phone": phone,
        "password_hash": hash_password(password),
        "is_active": True,
        "is_verified": False,
        "role": role
    }
    users_db[email] = user
    return user

def get_all_doctors() -> list:
    """Get all doctors from memory"""
    return list(doctors_db.values())

def get_doctor_by_id(doctor_id: str) -> Optional[dict]:
    """Get doctor by ID from memory"""
    return doctors_db.get(doctor_id)

def search_doctors(specialization: str = None, city: str = None) -> list:
    """Search doctors in memory"""
    results = list(doctors_db.values())
    
    if specialization:
        results = [d for d in results if specialization.lower() in d["specialization"].lower()]
    
    if city:
        results = [d for d in results if city.lower() == d["city"].lower()]
    
    return results
