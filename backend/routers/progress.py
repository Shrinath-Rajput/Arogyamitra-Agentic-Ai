from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from database import get_db, ProgressEntry, User, Achievement
from schemas import ProgressEntryCreate, ProgressEntryResponse, AchievementResponse
from .users import get_current_user

router = APIRouter(tags=["progress"])


@router.post("/progress/entry", response_model=ProgressEntryResponse)
def create_progress_entry(
    entry_data: ProgressEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a new progress entry"""
    # Convert measurements dict to JSON string
    measurements_json = None
    if entry_data.measurements:
        measurements_json = json.dumps(entry_data.measurements)
    
    entry = ProgressEntry(
        user_id=current_user.id,
        weight=entry_data.weight,
        body_fat_percentage=entry_data.body_fat_percentage,
        measurements=measurements_json,
        notes=entry_data.notes
    )
    
    db.add(entry)
    
    # Update user's current weight
    current_user.current_weight = entry_data.weight
    
    # Check for weight milestones and create achievements
    check_and_award_achievements(current_user, db)
    
    db.commit()
    db.refresh(entry)
    
    return entry


@router.get("/progress/entries", response_model=List[ProgressEntryResponse])
def get_progress_entries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 100
):
    """Get user's progress entries"""
    entries = db.query(ProgressEntry).filter(
        ProgressEntry.user_id == current_user.id
    ).order_by(ProgressEntry.date.desc()).limit(limit).all()
    
    return entries


@router.delete("/progress/entry/{entry_id}")
def delete_progress_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a progress entry"""
    entry = db.query(ProgressEntry).filter(
        ProgressEntry.id == entry_id,
        ProgressEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Progress entry not found")
    
    db.delete(entry)
    db.commit()
    
    return {"message": "Progress entry deleted successfully"}


@router.get("/progress/achievements", response_model=List[AchievementResponse])
def get_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's achievements"""
    achievements = db.query(Achievement).filter(
        Achievement.user_id == current_user.id
    ).order_by(Achievement.unlocked_at.desc()).all()
    
    return achievements


@router.get("/progress/stats")
def get_progress_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get progress statistics"""
    entries = db.query(ProgressEntry).filter(
        ProgressEntry.user_id == current_user.id
    ).order_by(ProgressEntry.date.asc()).all()
    
    if not entries:
        return {
            "total_entries": 0,
            "weight_change": 0,
            "progress_percentage": 0,
            "total_points": 0,
            "total_charity": 0
        }
    
    # Calculate stats
    first_weight = entries[0].weight
    current_weight = entries[-1].weight
    weight_change = first_weight - current_weight
    
    # Calculate progress toward target
    target_weight = current_user.target_weight
    progress_percentage = 0
    if target_weight and first_weight != target_weight:
        total_to_lose = abs(first_weight - target_weight)
        lost_so_far = abs(first_weight - current_weight)
        progress_percentage = min(100, (lost_so_far / total_to_lose) * 100)
    
    # Get achievement stats
    achievements = db.query(Achievement).filter(
        Achievement.user_id == current_user.id
    ).all()
    
    total_points = sum(a.points for a in achievements)
    total_charity = sum(a.charity_contribution for a in achievements)
    
    return {
        "total_entries": len(entries),
        "first_weight": first_weight,
        "current_weight": current_weight,
        "target_weight": target_weight,
        "weight_change": weight_change,
        "progress_percentage": round(progress_percentage, 1),
        "total_points": total_points,
        "total_charity": round(total_charity, 2),
        "achievement_count": len(achievements)
    }


def check_and_award_achievements(user: User, db: Session):
    """Check and award achievements based on progress"""
    # Check weight milestones
    if user.current_weight and user.target_weight:
        # Lost 1kg
        if hasattr(user, '_initial_weight') and user._initial_weight - user.current_weight >= 1:
            existing = db.query(Achievement).filter(
                Achievement.user_id == user.id,
                Achievement.achievement_type == "1kg_lost"
            ).first()
            
            if not existing:
                achievement = Achievement(
                    user_id=user.id,
                    achievement_type="1kg_lost",
                    title="First Kilogram!",
                    description="Lost your first 1kg - great start!",
                    points=100,
                    charity_contribution=10.0
                )
                db.add(achievement)
        
        # Lost 5kg
        if hasattr(user, '_initial_weight') and user._initial_weight - user.current_weight >= 5:
            existing = db.query(Achievement).filter(
                Achievement.user_id == user.id,
                Achievement.achievement_type == "5kg_lost"
            ).first()
            
            if not existing:
                achievement = Achievement(
                    user_id=user.id,
                    achievement_type="5kg_lost",
                    title="Half Way Hero!",
                    description="Amazing! You've lost 5kg!",
                    points=500,
                    charity_contribution=50.0
                )
                db.add(achievement)
