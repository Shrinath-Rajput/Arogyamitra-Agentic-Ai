from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from services.groq_service import get_workout_plan
from database import get_db, WorkoutPlan, User
from schemas import WorkoutPlanCreate, WorkoutPlanResponse
from .users import get_current_user

router = APIRouter(tags=["workout"])


@router.post("/workout/generate", response_model=WorkoutPlanResponse)
def generate_workout(
    request: WorkoutPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a new AI workout plan"""
    # Enhanced prompt with user profile context
    enhanced_prompt = f"""User Profile:
- Fitness Level: {current_user.fitness_level or 'Not specified'}
- Goal: {current_user.fitness_goal or 'general fitness'}
- Current Weight: {current_user.current_weight or 'Not specified'} kg
- Target Weight: {current_user.target_weight or 'Not specified'} kg

User Request: {request.prompt}

Please create a detailed 7-day workout plan including:
1. Daily workout structure with warm-up, main exercises, and cool-down
2. Specific exercises with sets, reps, and rest periods
3. Modifications for different fitness levels
4. Safety tips and form guidance
5. Suggest relevant YouTube video keywords for demonstrations
6. Daily fitness tips"""

    plan_content = get_workout_plan(enhanced_prompt)
    
    # Save to database
    workout_plan = WorkoutPlan(
        user_id=current_user.id,
        title=f"Workout Plan - {request.prompt[:50]}...",
        prompt=request.prompt,
        plan_content=plan_content,
        is_active=True
    )
    
    # Deactivate other plans
    db.query(WorkoutPlan).filter(
        WorkoutPlan.user_id == current_user.id,
        WorkoutPlan.is_active == True
    ).update({"is_active": False})
    
    db.add(workout_plan)
    db.commit()
    db.refresh(workout_plan)
    
    return workout_plan


@router.get("/workout/history", response_model=List[WorkoutPlanResponse])
def get_workout_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's workout plan history"""
    plans = db.query(WorkoutPlan).filter(
        WorkoutPlan.user_id == current_user.id
    ).order_by(WorkoutPlan.created_at.desc()).all()
    
    return plans


@router.get("/workout/{plan_id}", response_model=WorkoutPlanResponse)
def get_workout_plan_by_id(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific workout plan"""
    plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == plan_id,
        WorkoutPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")
    
    return plan


@router.delete("/workout/{plan_id}")
def delete_workout_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a workout plan"""
    plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == plan_id,
        WorkoutPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")
    
    db.delete(plan)
    db.commit()
    
    return {"message": "Workout plan deleted successfully"}
