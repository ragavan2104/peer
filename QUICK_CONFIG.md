# 🔧 Quick Configuration for Your Deployed Applications

## 🎯 Your Deployment URLs
- **Backend API:** https://peer-beta.vercel.app
- **Frontend App:** https://peer-x5pa.vercel.app

## ⚡ Immediate Actions Required

### 1. 🔧 Update Backend Environment Variables

Go to your **backend project** (peer-dusky) in Vercel dashboard:

1. **Settings** → **Environment Variables**
2. **Update `CLIENT_URL`:**
```env
CLIENT_URL = https://peer-x5pa.vercel.app
```
3. **Save and Redeploy** (Deployments → Click "..." → Redeploy)

### 2. 🎨 Update Frontend Environment Variables

Go to your **frontend project** (peer-x5pa) in Vercel dashboard:

1. **Settings** → **Environment Variables**
2. **Add/Update `VITE_API_URL`:**
```env
VITE_API_URL = https://peer-beta.vercel.app/api
```
3. **Save and Redeploy**

### 3. 🔥 Update Firebase Authorization

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **peer-b5111**
3. **Authentication** → **Settings** → **Authorized domains**
4. **Add domain:** `peer-x5pa.vercel.app`

## 🧪 Test Your Deployment

### Backend Tests:
- Health: https://peer-beta.vercel.app/api/health
- Projects: https://peer-beta.vercel.app/api/projects
- Users: https://peer-beta.vercel.app/api/users

### Frontend Test:
- Visit: https://peer-x5pa.vercel.app
- Try registration/login
- Check browser console for errors

## ✅ Complete Environment Variables

### Backend (peer-dusky):
```env
MONGODB_URI = mongodb+srv://ragavan:RAGAVAn21_@cluster0.kkovndt.mongodb.net/peer-project-hub?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET = peer_hub_jwt_secret_2025_ragavan_production_key_xyz789abc123
NODE_ENV = production
CLIENT_URL = https://peer-x5pa.vercel.app
```

### Frontend (peer-x5pa):
```env
VITE_API_URL = https://peer-beta.vercel.app/api
VITE_FIREBASE_API_KEY = AIzaSyDc_SYKlyMLHtidREPm1gP7mBxBBefw16I
VITE_FIREBASE_AUTH_DOMAIN = peer-b5111.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = peer-b5111
VITE_FIREBASE_STORAGE_BUCKET = peer-b5111.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 147085389719
VITE_FIREBASE_APP_ID = 1:147085389719:web:4c659f1c5364670df41ed2
```

## 🎉 After Configuration

Your Peer Project Hub will be fully functional at:
**https://peer-x5pa.vercel.app**

Users can:
- ✅ Register and login
- ✅ Create projects
- ✅ Browse projects
- ✅ Like and comment
- ✅ Manage profiles

**Complete these 3 steps and your application will be live and working!** 🚀
