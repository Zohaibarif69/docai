from fastapi import APIRouter, Query
from typing import List, Optional
from app.memory_state import get_all_doctors, get_doctor_by_id, search_doctors

router = APIRouter(prefix="/api/v1/doctors", tags=["doctors"])


@router.get("/")
def get_doctors(
    specialization: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    is_online: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    """
    Get list of doctors with optional filters
    """
    # Get all doctors
    doctors = get_all_doctors()
    
    # Filter by specialization
    if specialization:
        doctors = [d for d in doctors if specialization.lower() in d["specialization"].lower()]
    
    # Filter by city
    if city:
        doctors = [d for d in doctors if city.lower() == d["city"].lower()]
    
    # Filter by online status
    if is_online is not None:
        doctors = [d for d in doctors if d["is_online"] == is_online]
    
    # Sort by rating (descending)
    doctors = sorted(doctors, key=lambda x: x["rating"], reverse=True)
    
    # Apply pagination
    return doctors[skip : skip + limit]


@router.get("/{doctor_id}")
def get_doctor(doctor_id: str):
    """
    Get doctor details by ID
    """
    doctor = get_doctor_by_id(doctor_id)
    
    if not doctor:
        return {
            "error": "Doctor not found",
            "status_code": 404
        }
    
    return doctor


@router.get("/search")
def search_doctor(q: str = Query(...)):
    """
    Search doctors by name or specialization
    """
    doctors = get_all_doctors()
    
    query_lower = q.lower()
    results = [
        d for d in doctors
        if query_lower in d["name"].lower() or query_lower in d["specialization"].lower()
    ]
    
    # Sort by rating
    results = sorted(results, key=lambda x: x["rating"], reverse=True)
    
    return results
