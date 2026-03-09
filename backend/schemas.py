from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


# User schemas
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class UserProfile(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    current_weight: Optional[float] = None
    target_weight: Optional[float] = None
    fitness_level: Optional[str] = None
    health_conditions: Optional[List[str]] = []
    dietary_restrictions: Optional[List[str]] = []
    fitness_goal: Optional[str] = None


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    current_weight: Optional[float] = None
    target_weight: Optional[float] = None
    fitness_level: Optional[str] = None
    health_conditions: Optional[List[str]] = None
    dietary_restrictions: Optional[List[str]] = None
    fitness_goal: Optional[str] = None


class UserResponse(UserBase):
    id: int
    created_at: datetime
    age: Optional[int]
    gender: Optional[str]
    height: Optional[float]
    current_weight: Optional[float]
    target_weight: Optional[float]
    fitness_level: Optional[str]
    fitness_goal: Optional[str]
    
    class Config:
        from_attributes = True


# Workout schemas
class WorkoutPlanCreate(BaseModel):
    prompt: str = Field(..., min_length=10)


class WorkoutPlanResponse(BaseModel):
    id: int
    title: Optional[str]
    prompt: str
    plan_content: str
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True


# Meal plan schemas
class MealPlanCreate(BaseModel):
    prompt: str = Field(..., min_length=10)


class MealPlanResponse(BaseModel):
    id: int
    title: Optional[str]
    prompt: str
    plan_content: str
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True


# Progress schemas
class ProgressEntryCreate(BaseModel):
    weight: float
    body_fat_percentage: Optional[float] = None
    measurements: Optional[dict[str, float]] = None
    notes: Optional[str] = None


class ProgressEntryResponse(BaseModel):
    id: int
    date: datetime
    weight: float
    body_fat_percentage: Optional[float]
    measurements: Optional[str]
    notes: Optional[str]
    
    class Config:
        from_attributes = True


# Chat schemas
class ChatRequest(BaseModel):
    prompt: str = Field(..., min_length=1)


class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    timestamp: datetime
    
    class Config:
        from_attributes = True


# Achievement schemas
class AchievementResponse(BaseModel):
    id: int
    achievement_type: str
    title: str
    description: Optional[str]
    points: int
    charity_contribution: float
    unlocked_at: datetime
    
    class Config:
        from_attributes = True


# Response wrappers
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class MessageResponse(BaseModel):
    message: str
