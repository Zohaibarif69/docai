from fastapi import APIRouter, Depends, HTTPException, status, WebSocket
from sqlalchemy.orm import Session
from typing import List
from app.database.config import get_db
from app.database.models import Message, Patient, Doctor
from app.schemas.schemas import MessageCreate, MessageResponse, ChatHistoryResponse
from app.utils.jwt_handler import verify_token

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])


def get_current_patient(token: str, db: Session = Depends(get_db)):
    """Get current patient from token"""
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    patient = db.query(Patient).filter(Patient.user_id == user_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a patient"
        )
    
    return patient


@router.post("/send", response_model=MessageResponse)
def send_message(
    message_data: MessageCreate,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Send a message to doctor
    """
    patient = get_current_patient(token, db)
    
    # Verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == message_data.doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    # Create message
    message = Message(
        patient_id=patient.id,
        doctor_id=message_data.doctor_id,
        sender_type="patient",
        content=message_data.content
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    
    # TODO: Send notification to doctor
    
    return message


@router.get("/history/{doctor_id}", response_model=ChatHistoryResponse)
def get_chat_history(
    doctor_id: int,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Get chat history with a doctor
    """
    patient = get_current_patient(token, db)
    
    # Verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    # Get messages
    messages = db.query(Message).filter(
        Message.patient_id == patient.id,
        Message.doctor_id == doctor_id
    ).order_by(Message.created_at.asc()).all()
    
    # Mark messages as read
    for msg in messages:
        if msg.sender_type == "doctor" and not msg.is_read:
            msg.is_read = True
    db.commit()
    
    return ChatHistoryResponse(
        messages=messages,
        doctor=doctor
    )


@router.get("/list", response_model=List[dict])
def get_chat_list(
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Get list of all doctors patient has chatted with
    """
    patient = get_current_patient(token, db)
    
    # Get unique doctors patient has messages with
    messages = db.query(Message).filter(
        Message.patient_id == patient.id
    ).order_by(Message.created_at.desc()).all()
    
    doctor_ids = set()
    chat_list = []
    
    for msg in messages:
        if msg.doctor_id not in doctor_ids:
            doctor_ids.add(msg.doctor_id)
            doctor = db.query(Doctor).filter(Doctor.id == msg.doctor_id).first()
            
            # Count unread messages
            unread = db.query(Message).filter(
                Message.patient_id == patient.id,
                Message.doctor_id == msg.doctor_id,
                Message.sender_type == "doctor",
                Message.is_read == False
            ).count()
            
            chat_list.append({
                "id": msg.id,
                "doctorId": doctor.id,
                "doctorName": doctor.user.full_name,
                "specialization": doctor.specialization,
                "lastMessage": msg.content,
                "time": msg.created_at.strftime("%H:%M"),
                "unread": unread,
                "image": None,
                "isOnline": doctor.is_online
            })
    
    return chat_list


@router.put("/mark-as-read/{doctor_id}")
def mark_messages_as_read(
    doctor_id: int,
    token: str = None,
    db: Session = Depends(get_db)
):
    """
    Mark all messages from doctor as read
    """
    patient = get_current_patient(token, db)
    
    messages = db.query(Message).filter(
        Message.patient_id == patient.id,
        Message.doctor_id == doctor_id,
        Message.is_read == False
    ).update({"is_read": True})
    
    db.commit()
    
    return {"message": f"Marked {messages} messages as read"}


# WebSocket for real-time chat (optional)
@router.websocket("/ws/{doctor_id}/{patient_id}")
async def websocket_endpoint(
    doctor_id: int,
    patient_id: int,
    websocket: WebSocket
):
    """
    WebSocket endpoint for real-time messaging
    TODO: Implement real-time messaging
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # TODO: Save message to database
            # TODO: Broadcast to doctor
            await websocket.send_text(f"Message received: {data}")
    except Exception as e:
        print(f"WebSocket error: {e}")
