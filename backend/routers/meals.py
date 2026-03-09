from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from services.groq_service import get_meal_plan
from database import get_db, MealPlan, User
from schemas import MealPlanCreate, MealPlanResponse
from .users import get_current_user

router = APIRouter(tags=["meals"])


@router.post("/meals/generate", response_model=MealPlanResponse)
def generate_meals(
    request: MealPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a new AI meal plan"""
    # Parse dietary restrictions if exists
    dietary_restrictions = []
    if current_user.dietary_restrictions:
        try:
            dietary_restrictions = json.loads(current_user.dietary_restrictions)
        except:
            pass
    
    # Enhanced prompt with user profile context
    enhanced_prompt = f"""User Profile:
- Goal: {current_user.fitness_goal or 'general health'}
- Current Weight: {current_user.current_weight or 'Not specified'} kg
- Target Weight: {current_user.target_weight or 'Not specified'} kg
- Dietary Restrictions: {', '.join(dietary_restrictions) if dietary_restrictions else 'None'}

User Request: {request.prompt}

Please create a detailed 7-day meal plan including:
1. Daily meal structure (Breakfast, Lunch, Dinner, Snacks)
2. Specific recipes with ingredients and preparation instructions
3. Macro breakdown for each meal (Calories, Protein, Carbs, Fats)
4. Total daily macros
5. Indian cuisine focus with local ingredients
6. Allergen information and substitution options
7. Meal prep tips"""

    plan_content = get_meal_plan(enhanced_prompt)
    
    # Save to database
    meal_plan = MealPlan(
        user_id=current_user.id,
        title=f"Meal Plan - {request.prompt[:50]}...",
        prompt=request.prompt,
        plan_content=plan_content,
        is_active=True
    )
    
    # Deactivate other plans
    db.query(MealPlan).filter(
        MealPlan.user_id == current_user.id,
        MealPlan.is_active == True
    ).update({"is_active": False})
    
    db.add(meal_plan)
    db.commit()
    db.refresh(meal_plan)
    
    return meal_plan


@router.get("/meals/history", response_model=List[MealPlanResponse])
def get_meal_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's meal plan history"""
    plans = db.query(MealPlan).filter(
        MealPlan.user_id == current_user.id
    ).order_by(MealPlan.created_at.desc()).all()
    
    return plans


@router.get("/meals/{plan_id}", response_model=MealPlanResponse)
def get_meal_plan_by_id(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific meal plan"""
    plan = db.query(MealPlan).filter(
        MealPlan.id == plan_id,
        MealPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    
    return plan


@router.delete("/meals/{plan_id}")
def delete_meal_plan(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a meal plan"""
    plan = db.query(MealPlan).filter(
        MealPlan.id == plan_id,
        MealPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")
    
    db.delete(plan)
    db.commit()
    
    return {"message": "Meal plan deleted successfully"}
