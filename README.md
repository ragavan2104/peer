# Peer Project Hub

A modern web application for students and developers to share, discover, and review coding projects. Built with React, Node.js, Express, MongoDB, and Firebase Authentication.

## Features

### Stage 1: MVP (Minimum Viable Product)

✅ **User Authentication**
- Firebase Authentication (Email/Password)
- JWT tokens for API authentication
- Protected routes and middleware

✅ **Project Management (CRUD)**
- Create, Read, Update, Delete projects
- Required fields: Title, Description, Tags, GitHub URL
- Optional: Live Demo URL, Project Image

✅ **Project Feed**
- View all projects with pagination
- Sort by creation date, popularity, rating
- Responsive grid layout

✅ **Commenting System**
- Add comments to projects
- Nested comment support (replies)
- Real-time comment display

✅ **Responsive Design**
- Built with TailwindCSS
- Mobile-first responsive design
- Modern UI components with Headless UI

✅ **Backend API**
- RESTful API with Express.js
- MongoDB with Mongoose ODM
- Comprehensive error handling
- Input validation and sanitization

### Stage 2: Enhanced Features

🚧 **Search & Filter**
- Filter by tags, author, keywords
- Advanced search functionality

🚧 **Bookmarking/Favorites**
- Save favorite projects
- Personal favorites page

🚧 **Rating System**
- 5-star rating for projects
- Average rating calculation

🚧 **User Profiles**
- Public user profile pages
- User bio and project showcase

🚧 **Project Interaction**
- Like/Unlike projects
- View count tracking

🚧 **Pagination & Performance**
- Infinite scroll option
- Optimized database queries

## Tech Stack

### Frontend
- **React 18** - UI Framework
- **React Router** - Client-side routing
- **TailwindCSS** - Styling
- **Headless UI** - Accessible UI components
- **Heroicons** - Icon library
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Firebase** - Authentication
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Firebase Admin** - Authentication verification
- **JWT** - Token authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin requests
- **Rate Limiting** - API protection

## Project Structure

```
peer-project-hub/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts (Auth, etc.)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # App entry point
│   ├── public/              # Static assets
│   ├── package.json
│   └── vite.config.js
├── server/                   # Express API server
│   ├── controllers/         # Route handlers
│   ├── routes/              # API routes
│   ├── models/              # Database models
│   ├── middleware/          # Custom middleware
│   ├── server.js            # Server entry point
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Firebase project with Authentication enabled

### 1. Clone the Repository
```bash
git clone <repository-url>
cd peer-project-hub
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in the server directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/peer-project-hub
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Firebase Configuration
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication with Email/Password
3. Get your Firebase config from Project Settings
4. Update the frontend `.env` file with your Firebase config

### 5. MongoDB Setup
- **Local MongoDB**: Install and run MongoDB locally
- **MongoDB Atlas**: Create a cluster and get the connection string

## Running the Application

### Option 1: Manual Start
```bash
# Start backend (in server directory)
npm run dev

# Start frontend (in frontend directory)  
npm run dev
```

### Option 2: VS Code Tasks
1. Open in VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Tasks: Run Task"
4. Select "Start Full Application"

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify Firebase token and get JWT
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Projects
- `GET /api/projects` - Get all projects (with pagination, filters)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project (auth required)
- `PUT /api/projects/:id` - Update project (auth required, owner only)
- `DELETE /api/projects/:id` - Delete project (auth required, owner only)
- `POST /api/projects/:id/like` - Like/unlike project (auth required)
- `POST /api/projects/:id/rate` - Rate project (auth required)
- `POST /api/projects/:id/comments` - Add comment (auth required)
- `GET /api/projects/tags/popular` - Get popular tags

### Users
- `GET /api/users/:id` - Get user profile and projects
- `POST /api/users/favorites/:projectId` - Toggle favorite (auth required)
- `GET /api/users/favorites/me` - Get user's favorites (auth required)
- `GET /api/users/search/:query` - Search users

## Features Overview

### User Authentication
- Secure Firebase authentication
- JWT token-based API access
- Protected routes and components
- Automatic token refresh

### Project Management
- Rich project creation form with validation
- Image upload support
- Tag-based categorization
- GitHub integration
- Live demo links

### Social Features
- Like/unlike projects
- Star rating system
- Comment and reply system
- User favorites
- Project view tracking

### Search & Discovery
- Text search across projects
- Filter by tags, author, date
- Popular tags display
- Featured projects section

## Development

### Code Structure
- **Components**: Reusable UI components with proper prop types
- **Hooks**: Custom hooks for data fetching and state management
- **Context**: Global state management (Auth, Theme)
- **Utils**: Helper functions and API configuration
- **Validation**: Both client and server-side validation

### Best Practices
- Responsive design with mobile-first approach
- Accessibility considerations with Headless UI
- Error handling and loading states
- Form validation with React Hook Form
- API rate limiting and security headers
- Input sanitization and validation

## Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment settings

### Backend (Render/Railway/Heroku)
1. Create account on hosting platform
2. Connect GitHub repository
3. Set environment variables
4. Deploy from main branch

### Database
- Use MongoDB Atlas for production
- Set up proper indexes for performance
- Configure backup and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email your-email@example.com or create an issue on GitHub.

---

Built with ❤️ for the developer community
