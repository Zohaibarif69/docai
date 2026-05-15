from fastapi import APIRouter, Query, HTTPException, status
from typing import List, Optional
from datetime import datetime
from uuid import uuid4
from app.memory_state import get_doctor_by_id

router = APIRouter(prefix="/api/v1/chat", tags=["chat"])

# In-memory message storage
messages_db = {}


@router.post("/send", response_model=dict)
def send_message(
    doctor_id: str = Query(...),
    message_text: str = Query(...),
    token: Optional[str] = Query(None)
):
    """
    Send a message to doctor
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    # Verify doctor exists
    doctor = get_doctor_by_id(doctor_id)
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    # Create message in memory
    message_id = str(uuid4())
    message = {
        "id": message_id,
        "doctor_id": doctor_id,
        "message_text": message_text,
        "is_patient_message": True,
        "created_at": datetime.now().isoformat(),
        "read": False
    }
    
    # Store message by conversation key
    conv_key = f"{doctor_id}"
    if conv_key not in messages_db:
        messages_db[conv_key] = []
    
    messages_db[conv_key].append(message)
    
    return {
        "id": message_id,
        "doctor_id": doctor_id,
        "message_text": message_text,
        "is_patient_message": True,
        "created_at": datetime.now().isoformat()
    }


@router.get("/history/{doctor_id}", response_model=List[dict])
def get_chat_history(
    doctor_id: str,
    token: Optional[str] = Query(None)
):
    """
    Get chat history with a doctor
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    # Verify doctor exists
    doctor = get_doctor_by_id(doctor_id)
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    conv_key = f"{doctor_id}"
    messages = messages_db.get(conv_key, [])
    
    return messages


@router.get("/list", response_model=List[dict])
def get_conversations(
    token: Optional[str] = Query(None)
):
    """
    Get list of all conversations
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    # Return summary of conversations
    conversations = []
    for doctor_id, msgs in messages_db.items():
        if msgs:
            last_msg = msgs[-1]
            conversations.append({
                "doctor_id": doctor_id,
                "last_message": last_msg["message_text"],
                "last_message_time": last_msg["created_at"],
                "unread_count": len([m for m in msgs if not m["read"]])
            })
    
    return conversations
