from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import json

from services.groq_service import generate_ai_content
from database import get_db, ChatMessage, User
from schemas import ChatRequest, ChatMessageResponse
from .users import get_current_user

router = APIRouter(tags=["coach"])


@router.post("/coach/chat")
def chat_with_coach(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Chat with AROMI AI Coach"""
    # Get recent chat history for context
    recent_messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.timestamp.desc()).limit(10).all()
    
    # Build context from user profile
    health_conditions = []
    if current_user.health_conditions:
        try:
            health_conditions = json.loads(current_user.health_conditions)
        except:
            pass
    
    context = f"""You are AROMI, the AI coach for ArogyaMitra. 

User Context:
- Name: {current_user.full_name or current_user.username}
- Fitness Level: {current_user.fitness_level or 'Not specified'}
- Goal: {current_user.fitness_goal or 'general wellness'}
- Health Conditions: {', '.join(health_conditions) if health_conditions else 'None reported'}

Provide personalized, adaptive wellness coaching. Be encouraging and supportive."""
    
    # Combine context with user message
    full_prompt = f"{context}\n\nUser: {request.prompt}"
    
    # Get AI response
    response = generate_ai_content(full_prompt)
    
    # Save user message
    user_message = ChatMessage(
        user_id=current_user.id,
        role="user",
        content=request.prompt
    )
    db.add(user_message)
    
    # Save assistant response
    assistant_message = ChatMessage(
        user_id=current_user.id,
        role="assistant",
        content=response
    )
    db.add(assistant_message)
    
    db.commit()
    
    return {"response": response}


@router.get("/coach/history", response_model=List[ChatMessageResponse])
def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 50
):
    """Get chat history with AROMI"""
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.timestamp.desc()).limit(limit).all()
    
    return list(reversed(messages))


@router.delete("/coach/history")
def clear_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear chat history"""
    db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).delete()
    db.commit()
    
    return {"message": "Chat history cleared successfully"}
