# 🚀 Step-by-Step Server Deployment to Vercel

## 📋 Pre-Deployment Checklist
✅ Server code is ready
✅ vercel.json is configured
✅ Environment variables are ready
✅ MongoDB Atlas is accessible

## 🔧 Step 1: Prepare Your Code

### 1.1 Commit and Push Latest Changes
```powershell
git add .
git commit -m "🚀 Prepare server for Vercel deployment"
git push origin main
```

## 🌐 Step 2: Deploy Server to Vercel Website

### 2.1 Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"New Project"**

### 2.2 Import Your Repository
1. Find your repository in the list
2. Click **"Import"** next to your repository

### 2.3 Configure Project Settings
**IMPORTANT: Configure these settings correctly:**

- **Project Name**: `peer-project-hub-api` (or your preferred name)
- **Framework Preset**: Select **"Other"**
- **Root Directory**: Set to **`server`** (very important!)
- **Build Command**: Leave empty or set to `echo "No build needed"`
- **Output Directory**: Leave as `.` (dot)
- **Install Command**: `npm install`
- **Node.js Version**: 18.x (default)

### 2.4 Add Environment Variables
Before deploying, click **"Environment Variables"** and add:

```env
MONGODB_URI
mongodb+srv://ragavan:RAGAVAn21_@cluster0.kkovndt.mongodb.net/peer-project-hub?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET
peer_hub_jwt_secret_2025_ragavan_production_key_xyz789abc123

NODE_ENV
production

CLIENT_URL
https://peer-pvvu.vercel.app
```

### 2.5 Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete (usually 1-2 minutes)
3. **Save your backend URL** (e.g., `https://your-server-name.vercel.app`)

## 🧪 Step 3: Test Your Server Deployment

### 3.1 Test Health Endpoint
Visit: `https://your-server-name.vercel.app/api/health`
Should return:
```json
{
  "status": "OK",
  "message": "Peer Project Hub API is running",
  "timestamp": "2025-01-XX..."
}
```

### 3.2 Test API Endpoints
- `https://your-server-name.vercel.app/api/projects` → Should return `[]`
- `https://your-server-name.vercel.app/api/users` → Should return `[]`

## 🔄 Step 4: Update Frontend Configuration

### 4.1 Update Frontend Environment Variables
In your **frontend** Vercel project:
1. Go to Settings → Environment Variables
2. Update `VITE_API_URL` to your new server URL:
```env
VITE_API_URL
https://your-server-name.vercel.app/api
```

### 4.2 Redeploy Frontend
1. Go to Deployments tab
2. Click **"Redeploy"** on latest deployment
3. Select **"Use existing Build Cache"**

## ✅ Step 5: Final Verification

### 5.1 Check CORS
Your server should now accept requests from `https://peer-pvvu.vercel.app`

### 5.2 Test Full Stack
1. Visit your frontend: `https://peer-pvvu.vercel.app`
2. Try to register/login
3. Try to create a project
4. Verify no CORS errors in browser console

## 🆘 Troubleshooting

### Build Errors:
- Check build logs in Vercel dashboard
- Ensure `server` is set as root directory
- Verify all dependencies are in package.json

### API Not Found:
- Check vercel.json routes configuration
- Ensure environment variables are set
- Verify MongoDB connection string

### CORS Errors:
- Update CLIENT_URL environment variable
- Redeploy server after updating env vars
- Check browser console for exact error

---

## 🎯 Expected Result

After successful deployment:
- ✅ Server running at: `https://your-server-name.vercel.app`
- ✅ Health check works: `/api/health`
- ✅ API endpoints accessible: `/api/projects`, `/api/users`, `/api/auth`
- ✅ CORS configured for your frontend domain
- ✅ MongoDB Atlas connection working

**Ready to deploy? Let's start with Step 2!** 🚀
