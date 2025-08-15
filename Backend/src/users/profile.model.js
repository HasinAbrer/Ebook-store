const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    // Legacy key (no longer unique to avoid conflicts)
    email: { type: String, sparse: true },
    // Token-based keys
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    accountType: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    username: { type: String },
    displayName: { type: String },
    photoUrl: { type: String },
    phone: { type: String },
    address: {
      line1: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  },
  { timestamps: true }
);

// Ensure uniqueness per userId + accountType so admin and user can have separate profiles
profileSchema.index({ userId: 1, accountType: 1 }, { unique: true, sparse: true });

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
