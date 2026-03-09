# 🚀 Deploying ArogyaMitra to Netlify + Render

## Overview

- **Frontend (React)** → Netlify
- **Backend (FastAPI)** → Render or Railway

---

## 📦 Step 1: Deploy Frontend to Netlify

### Option A: Deploy via Netlify Website (Easiest)

1. **Go to [Netlify](https://app.netlify.com/)**
2. **Sign in** with GitHub
3. **Click "Add new site" → "Import an existing project"**
4. **Choose GitHub** and authorize
5. **Select repository:** `Arogyamitra`
6. **Configure build settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
7. **Add environment variable:**
   - Key: `VITE_API_URL`
   - Value: `http://localhost:8000` (update after backend deployment)
8. **Click "Deploy site"**

### Option B: Deploy via Netlify CLI

```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy (run from project root)
cd C:\Users\devil\Documents\trae_projects\AROGYAMITRA
netlify deploy --prod
```

---

## 🔧 Step 2: Deploy Backend to Render

### Option A: Via Render Website

1. **Go to [Render](https://render.com/)**
2. **Sign in** with GitHub
3. **Click "New +" → "Web Service"**
4. **Connect repository:** `Arogyamitra`
5. **Configure:**
   - **Name:** `arogyamitra-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Add Environment Variables:**
   ```
   GROQ_API_KEY=your_api_key_here
   SECRET_KEY=arogyamitra-secret-key-change-in-production
   DATABASE_URL=sqlite:///./arogyamitra.db
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
7. **Click "Create Web Service"**

### Option B: Alternative - Railway

1. **Go to [Railway](https://railway.app/)**
2. **Sign in** with GitHub
3. **New Project → Deploy from GitHub repo**
4. **Select `Arogyamitra`**
5. **Add variables** (same as above)
6. **Deploy**

---

## 🔗 Step 3: Connect Frontend to Backend

Once backend is deployed, you'll get a URL like:
```
https://arogyamitra-backend.onrender.com
```

### Update Netlify Environment Variable:

1. Go to **Netlify Dashboard** → Your site
2. **Site settings** → **Environment variables**
3. **Edit `VITE_API_URL`:**
   ```
   https://arogyamitra-backend.onrender.com
   ```
4. **Trigger redeploy** (Deploys → Trigger deploy → Deploy site)

---

## 📝 Important Notes

### CORS Configuration

Update `backend/main.py` CORS settings to include your Netlify URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://your-site-name.netlify.app"  # Add your Netlify URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Database Note

SQLite works for development but for production consider:
- **PostgreSQL** (Render provides free tier)
- **MongoDB** (MongoDB Atlas free tier)

---

## ✅ Verification

After deployment:

1. **Frontend:** https://your-site-name.netlify.app
2. **Backend:** https://arogyamitra-backend.onrender.com/docs
3. **Test:**
   - Register account
   - Test AI Coach
   - Generate workout/meal plans

---

## 🆓 Free Tier Limits

- **Netlify:** 100GB bandwidth/month
- **Render:** 750 hours/month (sleeps after inactivity)
- **Railway:** $5 free credits/month

---

## 🐛 Troubleshooting

### Frontend can't reach backend:
- Check CORS settings in backend
- Verify `VITE_API_URL` environment variable
- Check browser console for errors

### Backend sleeping (Render):
- Free tier sleeps after 15 min inactivity
- First request takes 30-60s to wake up
- Upgrade to paid plan for always-on

---

## 📞 Quick Deploy Commands

```powershell
# Build frontend locally to test
cd frontend
npm run build

# Test production build
npm run preview

# Push changes
git add .
git commit -m "chore: configure for Netlify deployment"
git push
```
