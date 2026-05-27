from groq import Groq
import os

groq_key = os.getenv("GROQ_API_KEY")

if not groq_key:
    raise Exception("GROQ_API_KEY not found")

# Temporary debug (remove later)
print(f"GROQ key loaded: {groq_key[:6]}...")

try:
    client = Groq(api_key=groq_key)
    print("✓ Groq client initialized")
except Exception as e:
    print(f"✗ Groq initialization failed: {e}")
    raise