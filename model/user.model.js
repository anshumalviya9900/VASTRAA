import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: function () { return !this.googleSignIn; }
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  verified: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  googleSignIn: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
});
export const User = mongoose.model('User', userSchema);

