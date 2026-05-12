from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database.config import get_db
from app.database.models import Doctor, User, Review
from app.schemas.schemas import DoctorCreate, DoctorResponse, DoctorSearchParams, DoctorListResponse
from app.utils.password_handler import hash_password

router = APIRouter(prefix="/api/v1/doctors", tags=["doctors"])


@router.get("/", response_model=List[DoctorListResponse])
def get_doctors(
    specialization: str = Query(None),
    city: str = Query(None),
    is_online: bool = Query(None),
    skip: int = Query(0),
    limit: int = Query(20),
    db: Session = Depends(get_db)
):
    """
    Get list of doctors with optional filters
    """
    query = db.query(Doctor).filter(Doctor.is_verified == True)
    
    if specialization:
        query = query.filter(Doctor.specialization.ilike(f"%{specialization}%"))
    
    if city:
        query = query.filter(Doctor.city.ilike(f"%{city}%"))
    
    if is_online is not None:
        query = query.filter(Doctor.is_online == is_online)
    
    # Sort by rating and availability
    doctors = query.order_by(Doctor.rating.desc()).offset(skip).limit(limit).all()
    
    result = []
    for doctor in doctors:
        result.append(DoctorListResponse(
            id=doctor.id,
            name=doctor.user.full_name,
            specialization=doctor.specialization,
            city=doctor.city,
            rating=doctor.rating,
            experience_years=doctor.experience_years,
            review_count=doctor.review_count,
            is_online=doctor.is_online,
            consultation_fee=doctor.consultation_fee,
            hospital=doctor.hospital,
            image=None,  # Add image URL from your storage
            verified=doctor.is_verified
        ))
    
    return result


@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor(
    doctor_id: int,
    db: Session = Depends(get_db)
):
    """
    Get specific doctor details
    """
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    return doctor


@router.get("/{doctor_id}/reviews")
def get_doctor_reviews(
    doctor_id: int,
    db: Session = Depends(get_db)
):
    """
    Get reviews for a specific doctor
    """
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    reviews = db.query(Review).filter(Review.doctor_id == doctor_id).all()
    return reviews


@router.get("/{doctor_id}/available-slots")
def get_available_slots(
    doctor_id: int,
    db: Session = Depends(get_db)
):
    """
    Get available consultation slots for a doctor
    """
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    from app.database.models import DoctorSlot
    slots = db.query(DoctorSlot).filter(
        DoctorSlot.doctor_id == doctor_id,
        DoctorSlot.is_available == True
    ).all()
    
    return slots


@router.put("/{doctor_id}")
def update_doctor_profile(
    doctor_id: int,
    doctor_data: dict,
    db: Session = Depends(get_db)
):
    """
    Update doctor profile
    """
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    # Update allowed fields
    for field, value in doctor_data.items():
        if field in ["hospital", "education", "bio", "consultation_fee", "languages", "is_online"]:
            setattr(doctor, field, value)
    
    db.commit()
    db.refresh(doctor)
    
    return doctor


@router.get("/search/symptoms", response_model=List[DoctorListResponse])
def search_by_symptoms(
    symptoms: str = Query(...),
    city: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Search doctors by symptoms using AI recommendation
    """
    from app.utils.ai_recommendations import recommend_doctors
    
    # Get all verified doctors
    query = db.query(Doctor).filter(Doctor.is_verified == True)
    
    if city:
        query = query.filter(Doctor.city.ilike(f"%{city}%"))
    
    doctors = query.all()
    
    # Get AI recommendations
    recommended, primary_spec, confidence = recommend_doctors(symptoms, doctors)
    
    result = []
    for doctor in recommended[:10]:  # Limit to top 10
        result.append(DoctorListResponse(
            id=doctor.id,
            name=doctor.user.full_name,
            specialization=doctor.specialization,
            city=doctor.city,
            rating=doctor.rating,
            experience_years=doctor.experience_years,
            review_count=doctor.review_count,
            is_online=doctor.is_online,
            consultation_fee=doctor.consultation_fee,
            hospital=doctor.hospital,
            image=None,
            verified=doctor.is_verified
        ))
    
    return result
