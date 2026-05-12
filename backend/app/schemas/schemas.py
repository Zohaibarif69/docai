from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List


# ==================== USER SCHEMAS ====================
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ==================== PATIENT SCHEMAS ====================
class PatientBase(BaseModel):
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(PatientBase):
    pass


class PatientResponse(PatientBase):
    id: int
    user_id: int
    user: UserResponse
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== DOCTOR SCHEMAS ====================
class DoctorBase(BaseModel):
    specialization: str
    experience_years: int
    hospital: Optional[str] = None
    education: Optional[str] = None
    bio: Optional[str] = None
    license_number: str
    consultation_fee: float
    languages: Optional[str] = None
    city: str


class DoctorCreate(DoctorBase):
    pass


class DoctorUpdate(BaseModel):
    hospital: Optional[str] = None
    education: Optional[str] = None
    bio: Optional[str] = None
    consultation_fee: Optional[float] = None
    languages: Optional[str] = None
    is_online: Optional[bool] = None


class DoctorResponse(DoctorBase):
    id: int
    user_id: int
    user: UserResponse
    is_verified: bool
    is_online: bool
    rating: float
    review_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class DoctorListResponse(BaseModel):
    id: int
    name: str
    specialization: str
    city: str
    rating: float
    experience_years: int
    review_count: int
    is_online: bool
    consultation_fee: float
    hospital: Optional[str]
    image: Optional[str]
    verified: bool


# ==================== DOCTOR SLOT SCHEMAS ====================
class DoctorSlotCreate(BaseModel):
    slot_date: str  # YYYY-MM-DD
    slot_time: str  # HH:MM


class DoctorSlotResponse(BaseModel):
    id: int
    doctor_id: int
    slot_date: str
    slot_time: str
    is_available: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== APPOINTMENT SCHEMAS ====================
class AppointmentCreate(BaseModel):
    doctor_id: int
    appointment_date: str  # YYYY-MM-DD
    appointment_time: str  # HH:MM
    appointment_type: str  # "Online" or "Physical"
    notes: Optional[str] = None


class AppointmentUpdate(BaseModel):
    appointment_date: Optional[str] = None
    appointment_time: Optional[str] = None
    appointment_type: Optional[str] = None
    notes: Optional[str] = None


class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_date: str
    appointment_time: str
    appointment_type: str
    status: str
    notes: Optional[str]
    created_at: datetime
    doctor: Optional[DoctorResponse]

    class Config:
        from_attributes = True


# ==================== MESSAGE SCHEMAS ====================
class MessageCreate(BaseModel):
    doctor_id: int
    content: str


class MessageResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    sender_type: str
    content: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ChatHistoryResponse(BaseModel):
    messages: List[MessageResponse]
    doctor: DoctorResponse


# ==================== NOTIFICATION SCHEMAS ====================
class NotificationCreate(BaseModel):
    notification_type: str
    title: str
    description: str


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    notification_type: str
    title: str
    description: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== REVIEW SCHEMAS ====================
class ReviewCreate(BaseModel):
    doctor_id: int
    appointment_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    rating: int
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== SEARCH & FILTER SCHEMAS ====================
class DoctorSearchParams(BaseModel):
    specialization: Optional[str] = None
    city: Optional[str] = None
    min_rating: Optional[float] = None
    max_fee: Optional[float] = None
    is_online: Optional[bool] = None
    language: Optional[str] = None
    skip: int = 0
    limit: int = 20


class AIRecommendationRequest(BaseModel):
    symptoms: str
    age: Optional[int] = None
    city: Optional[str] = None


class AIRecommendationResponse(BaseModel):
    recommended_doctors: List[DoctorListResponse]
    primary_specialization: str
    confidence: float
