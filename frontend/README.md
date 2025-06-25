# 🚀 Peer Project Hub – Frontend

<div align="center">
  
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**A modern, responsive web application for students and developers to share, discover, and review coding projects.**

*This is the frontend (React) portion of the Peer Project Hub full-stack project.*

[🌐 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [✨ Request Feature](#)

</div>

---

## ✨ Features

### 🔐 **Authentication & Security**
- **User Authentication**: Secure login/signup with Firebase Auth
- **Protected Routes**: Role-based access control for sensitive pages

### 📁 **Project Management**
- **CRUD Operations**: Create, view, edit, and delete coding projects
- **Rich Editor**: Comprehensive project creation with media support
- **Technology Tags**: Categorize projects with predefined tech stacks

### 🌟 **Discovery & Interaction**
- **Project Feed**: Browse, search, and filter projects with pagination
- **Advanced Search**: Filter by tags, author, keywords, and more
- **Commenting System**: Add and view comments on projects
- **Social Features**: Like, rate, and bookmark projects

### 👤 **User Experience**
- **User Profiles**: Public profile pages with project showcase and stats
- **Personal Dashboard**: Manage your projects and favorites
- **Analytics**: View detailed project and user statistics
- **Responsive Design**: Mobile-first, accessible, and beautiful UI

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **🎨 Frontend** | ![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white) |
| **🎯 Styling** | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white) ![Headless UI](https://img.shields.io/badge/Headless_UI-latest-000000?style=flat-square&logo=headlessui&logoColor=white) |
| **🗂️ Routing** | ![React Router](https://img.shields.io/badge/React_Router-6.x-CA4245?style=flat-square&logo=react-router&logoColor=white) |
| **🔐 Auth** | ![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black) |
| **🌐 HTTP** | ![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?style=flat-square&logo=axios&logoColor=white) |
| **📋 Forms** | ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.x-EC5990?style=flat-square&logo=reacthookform&logoColor=white) |
| **🔔 UI/UX** | ![React Hot Toast](https://img.shields.io/badge/React_Hot_Toast-2.x-FF6B6B?style=flat-square) ![Heroicons](https://img.shields.io/badge/Heroicons-2.x-8B5CF6?style=flat-square) |

</div>

## 📁 Project Structure

```
📦 frontend/
├── 📂 public/                 # 🖼️ Static assets
├── 📂 src/
│   ├── 📂 components/         # 🧩 Reusable UI components
│   │   ├── Layout.jsx         # 🏗️ Main layout wrapper
│   │   └── ProjectCard.jsx    # 📋 Project display card
│   ├── 📂 pages/              # 📄 Main app pages
│   │   ├── Home.jsx           # 🏠 Landing page
│   │   ├── Login.jsx          # 🔐 Authentication
│   │   ├── Signup.jsx         # ✍️ User registration
│   │   ├── CreateProject.jsx  # ➕ Project creation
│   │   ├── ProjectDetail.jsx  # 🔍 Project view
│   │   ├── Explore.jsx        # 🔎 Search & browse
│   │   ├── MyProjects.jsx     # 👤 User dashboard
│   │   ├── Favorites.jsx      # ❤️ Saved projects
│   │   └── UserProfile.jsx    # 👤 Public profiles
│   ├── 📂 contexts/           # 🌐 React context
│   │   └── AuthContext.jsx    # 🔐 Authentication state
│   ├── 📂 hooks/              # 🎣 Custom React hooks
│   │   └── useProjects.js     # 📊 Project data hooks
│   ├── 📂 utils/              # 🛠️ Utilities & config
│   │   ├── api.js             # 🌐 API client
│   │   ├── firebase.js        # 🔥 Firebase config
│   │   └── helpers.js         # 🧰 Helper functions
│   ├── App.jsx                # 🎯 Main app component
│   └── main.jsx               # 🚀 Entry point
├── 📄 package.json            # 📦 Dependencies
├── 📄 tailwind.config.js      # 🎨 Tailwind config
└── 📄 README.md               # 📖 This file
```

## 🚀 Getting Started

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18+ recommended) ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
- **npm** or **yarn** package manager
- **Backend API** running (see main project README)
- **Firebase project** with Email/Password Auth enabled

### ⚡ Quick Setup

1. **📥 Clone the repository**
   ```bash
   git clone <repository-url>
   cd peeer/frontend
   ```

2. **📦 Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **⚙️ Environment Configuration**
   
   Create a `.env` file in the `frontend/` directory:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:5001/api

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. **🎯 Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   🌐 **The app will be available at:** [http://localhost:5173](http://localhost:5173)

### 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing one
3. Enable **Authentication** → **Email/Password**
4. Get your config from **Project Settings** → **General** → **Your apps**
5. Add the config values to your `.env` file

## 📱 Usage Guide

### 🔐 **Authentication**
- **Sign up** with email and password to create your account
- **Log in** to access all platform features
- **Protected routes** ensure secure access to user-specific content

### 🛠️ **Project Management**
- **➕ Create projects** with rich descriptions and technology tags
- **📊 View analytics** including likes, views, and ratings
- **✏️ Edit/Delete** your own projects
- **🏷️ Categorize** with predefined technology dropdown

### 🔍 **Discovery & Exploration**
- **🌐 Browse** all public projects on the home feed
- **🔎 Search & Filter** by technologies, keywords, or authors
- **📈 Sort** by popularity, date, or rating
- **🔖 Bookmark** favorite projects for quick access

### 🤝 **Social Interaction**
- **❤️ Like** projects you find interesting
- **⭐ Rate** projects (1-5 stars)
- **💬 Comment** and engage with the community
- **👤 Visit profiles** to see user's project portfolio

---

## 🔧 Available Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| **🚀 `npm run dev`** | Start development server | Local development |
| **🏗️ `npm run build`** | Build for production | Deployment |
| **🔍 `npm run lint`** | Lint code with ESLint | Code quality |
| **👀 `npm run preview`** | Preview production build | Testing |

---

## 🌍 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:5001/api` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |

> 💡 **Tip:** Copy `.env.example` to `.env` and fill in your Firebase and API details.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 **Bug Reports**
1. Check existing issues first
2. Create detailed bug report with steps to reproduce
3. Include screenshots if applicable

### ✨ **Feature Requests**
1. Open an issue with feature description
2. Explain use case and benefits
3. Discuss implementation approach

### 🔧 **Code Contributions**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📝 **Development Guidelines**
- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation when needed

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](../LICENSE) file for details.

---

## 🔗 Links & Resources

- 📚 **[Full-Stack Documentation](../README.md)** - Complete project setup
- 🔧 **[Backend Repository](../server/)** - API documentation
- 🔥 **[Firebase Docs](https://firebase.google.com/docs)** - Authentication setup
- 🎨 **[Tailwind CSS](https://tailwindcss.com)** - Styling framework
- ⚛️ **[React Documentation](https://react.dev)** - React guides

---

<div align="center">

**Made with ❤️ by the development community**

⭐ **Star this repo if you find it helpful!** ⭐

</div>
