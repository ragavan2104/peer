import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  photoURL: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  githubUsername: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// These indexes are already created by unique: true constraint
// userSchema.index({ firebaseUid: 1 });
// userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);
