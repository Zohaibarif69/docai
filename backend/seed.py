"""
Seed script to populate the database with test data
Run this once to add test users and doctors
"""

from app.database.config import SessionLocal
from app.database.models import User, Patient, Doctor, DoctorSlot
from app.utils.password_handler import hash_password
from datetime import datetime

db = SessionLocal()

# Test users data
test_data = {
    "patients": [
        {
            "email": "patient@test.com",
            "full_name": "Ali Khan",
            "phone": "+92 300 1234567",
            "password": "password123"
        },
        {
            "email": "patient2@test.com",
            "full_name": "Fatima Ahmed",
            "phone": "+92 321 9876543",
            "password": "password123"
        }
    ],
    "doctors": [
        {
            "email": "doctor1@test.com",
            "full_name": "Dr. Ahmed Khan",
            "phone": "+92 311 5678901",
            "password": "password123",
            "specialization": "Cardiologist",
            "experience_years": 14,
            "hospital": "Lahore Heart Center",
            "education": "MBBS, FCPS (Cardiology) – King Edward Medical University",
            "license_number": "PMC-12345",
            "consultation_fee": 2500,
            "city": "Lahore",
            "languages": "Urdu, English"
        },
        {
            "email": "doctor2@test.com",
            "full_name": "Dr. Sara Malik",
            "phone": "+92 333 2468013",
            "password": "password123",
            "specialization": "Dermatologist",
            "experience_years": 9,
            "hospital": "Karachi Skin Clinic",
            "education": "MBBS, FCPS (Dermatology)",
            "license_number": "PMC-12346",
            "consultation_fee": 2000,
            "city": "Karachi",
            "languages": "Urdu, English, Sindhi"
        },
        {
            "email": "doctor3@test.com",
            "full_name": "Dr. Hassan Ali",
            "phone": "+92 322 1357924",
            "password": "password123",
            "specialization": "Orthopedic Surgeon",
            "experience_years": 11,
            "hospital": "Islamabad Orthopedic Center",
            "education": "MBBS, FCPS (Orthopedics)",
            "license_number": "PMC-12347",
            "consultation_fee": 2800,
            "city": "Islamabad",
            "languages": "Urdu, English"
        }
    ]
}

def seed_database():
    """Populate database with test data"""
    
    try:
        # Check if data already exists
        existing_patient = db.query(User).filter(User.email == "patient@test.com").first()
        if existing_patient:
            print("✅ Database already seeded! Skipping...")
            return

        # Add test patients
        print("📝 Adding test patients...")
        for patient_data in test_data["patients"]:
            user = User(
                email=patient_data["email"],
                full_name=patient_data["full_name"],
                phone=patient_data["phone"],
                password_hash=hash_password(patient_data["password"]),
                is_active=True,
                is_verified=True
            )
            db.add(user)
            db.flush()
            
            # Create patient profile
            patient = Patient(
                user_id=user.id,
                gender="M" if "Ali" in patient_data["full_name"] else "F",
                blood_group="O+"
            )
            db.add(patient)
            print(f"  ✓ {patient_data['full_name']} ({patient_data['email']})")

        # Add test doctors
        print("\n👨‍⚕️ Adding test doctors...")
        for doctor_data in test_data["doctors"]:
            user = User(
                email=doctor_data["email"],
                full_name=doctor_data["full_name"],
                phone=doctor_data["phone"],
                password_hash=hash_password(doctor_data["password"]),
                is_active=True,
                is_verified=True
            )
            db.add(user)
            db.flush()
            
            # Create doctor profile
            doctor = Doctor(
                user_id=user.id,
                specialization=doctor_data["specialization"],
                experience_years=doctor_data["experience_years"],
                hospital=doctor_data["hospital"],
                education=doctor_data["education"],
                license_number=doctor_data["license_number"],
                consultation_fee=doctor_data["consultation_fee"],
                city=doctor_data["city"],
                languages=doctor_data["languages"],
                is_verified=True,
                is_online=True,
                rating=4.5 if "Ahmed" in doctor_data["full_name"] else 4.2 if "Sara" in doctor_data["full_name"] else 4.8,
                review_count=10
            )
            db.add(doctor)
            db.flush()
            
            # Add sample slots for each doctor
            for day_offset in range(7):
                from datetime import datetime, timedelta
                slot_date = (datetime.now() + timedelta(days=day_offset)).strftime("%Y-%m-%d")
                
                for hour in [9, 11, 14, 16]:
                    slot_time = f"{hour:02d}:00"
                    slot = DoctorSlot(
                        doctor_id=doctor.id,
                        slot_date=slot_date,
                        slot_time=slot_time,
                        is_available=True
                    )
                    db.add(slot)
            
            print(f"  ✓ {doctor_data['full_name']} ({doctor_data['email']}) - {doctor_data['specialization']}")

        # Commit all changes
        db.commit()
        
        print("\n" + "="*50)
        print("✅ Database seeded successfully!")
        print("="*50)
        print("\n📋 Test Credentials:")
        print("\nPatients:")
        for patient in test_data["patients"]:
            print(f"  Email: {patient['email']}")
            print(f"  Password: {patient['password']}")
            print()
        
        print("Doctors:")
        for doctor in test_data["doctors"]:
            print(f"  Email: {doctor['email']}")
            print(f"  Password: {doctor['password']}")
            print()
        
        print("="*50)
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
