# ArogyaMitra - Complete Testing Guide

## ✅ Pre-Testing Checklist

1. **Backend Server Running**: `http://localhost:8000`
2. **Frontend Server Running**: `http://localhost:5173`
3. **Groq API Key**: Set in `backend/.env`

## 🧪 Complete Feature Testing Flow

### 1. User Registration & Authentication
**Test Case 1.1: Register New User**
- Navigate to `http://localhost:5173/register`
- Fill in:
  - Username: `testuser`
  - Email: `test@example.com`
  - Full Name: `Test User`
  - Password: `testpass123`
- Click "Sign Up"
- ✅ Should auto-login and redirect to dashboard

**Test Case 1.2: Login with Admin**
- Logout if logged in
- Go to `http://localhost:5173/login`
- Credentials:
  - Username: `admin`
  - Password: `admin123`
- Click "Login"
- ✅ Should redirect to dashboard

**Test Case 1.3: Login with Test User**
- Logout
- Login with `testuser` / `testpass123`
- ✅ Should show personalized dashboard

---

### 2. Profile Management
**Test Case 2.1: Complete Profile**
- Click "Profile" in sidebar
- Fill in all fields:
  - Email: (already filled)
  - Full Name: `John Doe`
  - Age: `28`
  - Gender: `Male`
  - Height: `175` cm
  - Current Weight: `80` kg
  - Target Weight: `75` kg
  - Fitness Level: `Intermediate`
  - Fitness Goal: `Weight Loss`
  - Health Conditions: `None`
  - Dietary Restrictions: `Vegetarian`
- Click "Update Profile"
- ✅ Should show "Profile updated successfully"
- ✅ Progress bar should show 100%

**Test Case 2.2: Verify Profile Data**
- Refresh the page
- ✅ All data should persist
- Navigate to Dashboard
- ✅ Welcome message should show "John Doe"

---

### 3. Workout Plan Generation
**Test Case 3.1: Generate First Workout Plan**
- Click "Workout Plan" in sidebar
- In the prompt field, enter:
  > "Create a weight loss workout plan focusing on cardio and strength training"
- Click "Generate New Plan"
- ⏳ Wait for AI to generate (5-15 seconds)
- ✅ Should display 7-day workout plan
- ✅ Plan should be personalized based on profile (Intermediate, Weight Loss)

**Test Case 3.2: View Workout History**
- Generate another plan with different prompt
- ✅ Left sidebar should show history with timestamps
- Click on previous plan in history
- ✅ Should load that plan

**Test Case 3.3: Delete Workout Plan**
- In history sidebar, click "Delete" on a plan
- ✅ Plan should be removed from history

---

### 4. Meal Plan Generation
**Test Case 4.1: Generate Meal Plan**
- Click "Meal Plan" in sidebar
- Enter prompt:
  > "Create a vegetarian meal plan for weight loss with high protein"
- Click "Generate New Plan"
- ⏳ Wait for AI generation
- ✅ Should show 7-day meal plan
- ✅ Should include macros (calories, protein, carbs, fats)
- ✅ Should respect "Vegetarian" dietary restriction from profile

**Test Case 4.2: Verify Meal Plan Persistence**
- Navigate away and come back
- ✅ Last generated plan should still be visible
- ✅ History should show all generated plans

---

### 5. AI Coach (AROMI)
**Test Case 5.1: Chat with AI Coach**
- Click "AI Coach" in sidebar
- Send message:
  > "What exercises are best for burning belly fat?"
- ✅ Should get personalized response based on your profile
- Send another message:
  > "I feel tired after workouts, any tips?"
- ✅ Conversation should have context (remember previous messages)

**Test Case 5.2: Chat History Persistence**
- Refresh the page
- ✅ Previous chat messages should load
- Continue conversation
- ✅ New messages should append to history

**Test Case 5.3: Clear Chat History**
- Click "Clear History" button
- ✅ All messages should be deleted
- Send new message
- ✅ Should start fresh conversation

---

### 6. Progress Tracking & Achievements
**Test Case 6.1: Add First Weight Entry**
- Click "Progress" in sidebar
- Enter weight: `79.5` kg
- Click "Save Entry"
- ✅ Should show in weight history
- ✅ Stats cards should update:
  - Current Weight: 79.5 kg
  - Weight Change: -0.5 kg
  - Progress: ~10%

**Test Case 6.2: Track Progress Over Time**
- Add another entry: `79.0` kg
- Add another entry: `78.5` kg
- ✅ Weight history should show all entries with dates
- ✅ Weight change should calculate correctly
- ✅ Progress percentage should increase

**Test Case 6.3: Unlock Achievements**
- Continue adding weight entries showing progress
- When weight loss >= 1kg:
  - ✅ "First Kilogram" achievement unlocked (50 pts, ₹5 charity)
- When weight loss >= 5kg:
  - ✅ "Five Kilogram Milestone" achievement unlocked (250 pts, ₹25 charity)
- Check achievements section:
  - ✅ Should display unlocked achievements with badges
  - ✅ Total points should sum correctly
  - ✅ Total charity contribution should display

---

### 7. Navigation & UI
**Test Case 7.1: Sidebar Navigation**
- Click each menu item:
  - Dashboard ✅
  - Workout Plan ✅
  - Meal Plan ✅
  - Progress ✅
  - AI Coach ✅
  - Profile ✅
- ✅ Active page should be highlighted
- ✅ Each page should load without errors

**Test Case 7.2: Dashboard Cards Navigation**
- Go to Dashboard
- Click "View Plan" on Workout card
- ✅ Should navigate to Workout Plan page
- Return to Dashboard
- Click other cards
- ✅ All navigation should work

**Test Case 7.3: Logout**
- Click "Logout" button
- ✅ Should redirect to login page
- Try accessing dashboard directly: `http://localhost:5173/dashboard`
- ✅ Should redirect to login (protected route)

---

## 🔍 Backend API Testing (Optional)

### Test API Endpoints Directly

**Check API Health**
```bash
curl http://localhost:8000/
```
✅ Should return welcome message

**Check API Docs**
- Open `http://localhost:8000/docs`
- ✅ Should show interactive Swagger UI with all endpoints

**Test Workout Generation**
```bash
curl -X POST http://localhost:8000/workout/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "beginner workout plan"}'
```

---

## 🐛 Common Issues & Fixes

### Issue: "email-validator not installed"
**Fix**: `cd backend; pip install email-validator`

### Issue: Frontend shows "Network Error"
**Fix**: 
- Check backend is running on port 8000
- Check `frontend/src/services/api.ts` has correct API URL

### Issue: Groq API Error
**Fix**:
- Verify `GROQ_API_KEY` in `backend/.env`
- Get free API key at https://console.groq.com/

### Issue: Database not found
**Fix**:
- Backend creates `arogyamitra.db` automatically on first run
- Delete and restart backend to recreate: `rm backend/arogyamitra.db`

---

## ✅ Test Results Summary

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ⬜ | |
| Login (Admin) | ⬜ | |
| Login (User) | ⬜ | |
| Profile Management | ⬜ | |
| Workout Generation | ⬜ | |
| Meal Plan Generation | ⬜ | |
| AI Coach Chat | ⬜ | |
| Chat History | ⬜ | |
| Progress Tracking | ⬜ | |
| Achievements | ⬜ | |
| Navigation | ⬜ | |
| Data Persistence | ⬜ | |

**Overall Status**: ___/12 Passed

---

## 📊 Performance Benchmarks

- **Page Load Time**: < 2 seconds
- **AI Response Time**: 5-15 seconds (depends on Groq API)
- **Database Query Time**: < 100ms
- **Frontend Hot Reload**: < 1 second

---

## 🎯 Next Steps After Testing

1. ✅ All features working → **Production Ready!**
2. ❌ Some failures → Review errors and fix
3. 💡 Enhancement ideas:
   - Add visual charts for progress (Chart.js)
   - Export plans as PDF
   - Social sharing for achievements
   - Workout/meal calendar view
   - Reminder notifications
   - Water intake tracking
   - Sleep tracking
   - Integration with fitness wearables

---

**Testing Date**: _______________  
**Tested By**: _______________  
**Environment**: Development  
**Result**: ⬜ Pass | ⬜ Fail | ⬜ Partial
