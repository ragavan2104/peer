# 🌐 Vercel Website Deployment Guide - Peer Project Hub

Complete step-by-step guide to deploy your full-stack application using the Vercel website interface.

## 📋 Prerequisites

- [x] GitHub account with your code pushed to a repository
- [x] Vercel account (sign up at [vercel.com](https://vercel.com))
- [x] MongoDB Atlas cluster configured
- [x] Firebase project configured (for authentication)

---

## 🚀 Step 1: Prepare Your GitHub Repository

### 1.1 Push Your Code to GitHub
1. Create a new repository on GitHub
2. Push your entire project folder to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - Peer Project Hub"
git branch -M main
git remote add origin https://github.com/your-username/peer-project-hub.git
git push -u origin main
```

---

## 🔧 Step 2: Deploy Backend to Vercel

### 2.1 Import Backend Project
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. **Important:** In the "Configure Project" step:
   - Set **Root Directory** to: `server`
   - Set **Framework Preset** to: `Other`
   - Leave **Build Command** empty (or set to: `echo "No build needed"`)
   - Set **Output Directory** to: `.` (current directory)
   - Set **Install Command** to: `npm install`

### 2.2 Configure Backend Environment Variables
In the Vercel dashboard for your backend project:

1. Go to **Settings** → **Environment Variables**
2. Add these variables one by one:

```env
MONGODB_URI
Value: mongodb+srv://ragavan:RAGAVAn21_@cluster0.kkovndt.mongodb.net/peer-project-hub?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET
Value: peer_hub_jwt_secret_2025_ragavan_production_key_xyz789abc123

NODE_ENV
Value: production

CLIENT_URL
Value: (Leave empty for now, will update after frontend deployment)
```

### 2.3 Deploy Backend
1. Click **"Deploy"**
2. Wait for deployment to complete
3. **Save your backend URL** (e.g., `https://your-backend-name.vercel.app`)

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Import Frontend Project
1. Click **"New Project"** again
2. Import the same GitHub repository
3. **Important:** In the "Configure Project" step:
   - Set **Root Directory** to: `frontend`
   - Set **Framework Preset** to: `Vite`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### 3.2 Configure Frontend Environment Variables
In the Vercel dashboard for your frontend project:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```env
VITE_API_URL
Value: https://peer-tif.vercel.app/api

VITE_FIREBASE_API_KEY
Value: AIzaSyDc_SYKlyMLHtidREPm1gP7mBxBBefw16I

VITE_FIREBASE_AUTH_DOMAIN
Value: peer-b5111.firebaseapp.com

VITE_FIREBASE_PROJECT_ID
Value: peer-b5111

VITE_FIREBASE_STORAGE_BUCKET
Value: peer-b5111.firebasestorage.app

VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 147085389719

VITE_FIREBASE_APP_ID
Value: 1:147085389719:web:4c659f1c5364670df41ed2
```

### 3.3 Deploy Frontend
1. Click **"Deploy"**
2. Wait for deployment to complete
3. **Save your frontend URL** (e.g., `https://your-frontend-name.vercel.app`)

---

## 🔄 Step 4: Update Backend CORS Configuration

### 4.1 Update Backend Environment Variables
1. Go back to your **backend project** in Vercel dashboard
2. Go to **Settings** → **Environment Variables**
3. Update the `CLIENT_URL` variable:
```env
CLIENT_URL
Value: https://peer-pvvu.vercel.app
```

### 4.2 Redeploy Backend
1. Go to **Deployments** tab in your backend project
2. Click the **three dots** on the latest deployment
3. Click **"Redeploy"**
4. Select **"Use existing Build Cache"**
5. Click **"Redeploy"**

---

## 🗄️ Step 5: Configure MongoDB Atlas

### 5.1 Network Access
1. Login to [MongoDB Atlas](https://cloud.mongodb.com)
2. Go to **Network Access**
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** (`0.0.0.0/0`)
5. Click **"Confirm"**

### 5.2 Verify Database
1. Go to **Database** → **Browse Collections**
2. Your database `peer-project-hub` should be visible
3. Collections (`users`, `projects`, `comments`) will be created automatically when your app runs

---

## 🔥 Step 6: Configure Firebase

### 6.1 Add Authorized Domains
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel frontend domain:
   - `your-frontend-name.vercel.app`
5. Click **"Add domain"**

---

## 🧪 Step 7: Test Your Deployment

### 7.1 Test Backend API
Visit these URLs in your browser:
- `https://your-backend-name.vercel.app/api/projects` (should return empty array `[]`)
- `https://your-backend-name.vercel.app/api/users` (should return empty array `[]`)

### 7.2 Test Frontend
1. Visit `https://your-frontend-name.vercel.app`
2. Try to register a new account
3. Try to login
4. Try to create a project
5. Verify everything works properly

---

## 🎯 Your Deployment URLs

After completing all steps, you'll have:

**🎨 Frontend (User Interface):**
`https://your-frontend-name.vercel.app`

**📡 Backend API:**
`https://your-backend-name.vercel.app`

**🗄️ Database:**
MongoDB Atlas (automatically connected)

---

## 🔍 Troubleshooting

### Common Issues:

**❌ "CORS Error"**
- Solution: Verify `CLIENT_URL` in backend environment variables
- Make sure you redeployed backend after updating `CLIENT_URL`

**❌ "Network Error" when calling API**
- Solution: Check `VITE_API_URL` in frontend environment variables
- Ensure it points to your correct backend URL with `/api` at the end

**❌ "Database Connection Error"**
- Solution: Verify MongoDB Atlas network access allows `0.0.0.0/0`
- Check MongoDB connection string is correct

**❌ "Firebase Auth Error"**
- Solution: Add your Vercel domain to Firebase authorized domains
- Verify all Firebase environment variables are correct

**❌ Build Fails**
- Solution: Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`

---

## 🎉 Success!

Your Peer Project Hub is now live on Vercel! 

### Share Your Project:
- Frontend: `https://your-frontend-name.vercel.app`
- Users can register, login, create projects, and collaborate!

### Monitor Your App:
- Check Vercel dashboard for deployment status
- Monitor MongoDB Atlas for database usage
- Track user activity and project submissions

**Congratulations! Your full-stack application is now live! 🚀**
