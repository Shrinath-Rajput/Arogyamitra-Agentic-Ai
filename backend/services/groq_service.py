import os
from groq import Groq

api_key = os.environ.get("GROQ_API_KEY")
if not api_key or api_key == "your-groq-api-key":
    client = None
else:
    client = Groq(api_key=api_key)

def generate_ai_content(prompt: str) -> str:
    if client is None:
        return "⚠️ AI Service is not configured. Please set a valid GROQ_API_KEY in the backend .env file."
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are AROMI (ArogyaMitra AI), a highly knowledgeable and encouraging health, fitness, and nutrition expert. Your goal is to provide personalized, accurate, and actionable advice to help users reach their wellness goals. Always maintain a professional yet friendly and motivating tone. Keep responses concise and practical.",
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1024,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        error_msg = str(e)
        print(f"Groq API Error: {error_msg}")  # Log to console for debugging
        
        # Provide more helpful error messages
        if "authentication" in error_msg.lower() or "api key" in error_msg.lower():
            return "⚠️ Invalid API key. Please check your GROQ_API_KEY in the backend .env file."
        elif "rate limit" in error_msg.lower():
            return "⚠️ API rate limit exceeded. Please wait a moment and try again."
        elif "model" in error_msg.lower():
            return "⚠️ AI model unavailable. The service may be temporarily down."
        else:
            return f"⚠️ AI Service Error: {error_msg}. Please contact support if this persists."

def get_workout_plan(prompt: str) -> str:
    return generate_ai_content(f"Create a detailed workout plan based on this request: {prompt}")

def get_meal_plan(prompt: str) -> str:
    return generate_ai_content(f"Create a detailed meal plan based on this request: {prompt}")
