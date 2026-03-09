# Troubleshooting Guide

## Error: "Sorry, I encountered an error. Please try again."

This error in the AI Coach chat can have several causes:

### 1. Backend Not Running ❌
**Solution:** Make sure both servers are running
```powershell
.\run aromi
```
You should see TWO windows open - one for backend, one for frontend.

### 2. Invalid Groq API Key ⚠️
**Solution:** Check your API key in `backend/.env`
- Go to https://console.groq.com/ to get your API key
- Open `backend/.env` and ensure it looks like this:
```
GROQ_API_KEY=gsk_your_actual_key_here
```
- Restart the backend server after changing the key

### 3. Rate Limit Exceeded 🔄
**Solution:** Wait 1-2 minutes and try again
- Groq has rate limits for free tier
- If persistent, check your Groq dashboard for limits

### 4. Check Your Setup ✅
Run this command to verify everything is configured:
```powershell
python check_setup.py
```

This will check:
- ✅ .env file exists
- ✅ GROQ_API_KEY is set
- ✅ Python dependencies installed
- ✅ Groq API connection works

### 5. Connection Issues 🌐
**Check if backend is accessible:**
1. Open browser to: http://localhost:8000/docs
2. You should see the API documentation
3. If not, backend might not be running

**Check browser console:**
1. Press F12 in your browser
2. Click "Console" tab
3. Look for error messages (they should now be more specific)

### Quick Fix Steps:
1. **Stop all running servers** (close the PowerShell windows)
2. **Check your setup:**
   ```powershell
   python check_setup.py
   ```
3. **Fix any issues** reported
4. **Restart servers:**
   ```powershell
   .\run aromi
   ```
5. **Try the AI Coach again**

### Still Having Issues?
Check the backend terminal window for error messages. The improved error handling will now show:
- ⚠️ Invalid API key
- ⚠️ Rate limit exceeded  
- ⚠️ Model unavailable
- ⚠️ Connection errors

---

## Other Common Issues

### Frontend won't start
```powershell
cd frontend
npm install
npm run dev
```

### Backend won't start
```powershell
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Database issues
Delete and recreate the database:
```powershell
cd backend
Remove-Item arogyamitra.db
# Then restart backend to recreate
```
