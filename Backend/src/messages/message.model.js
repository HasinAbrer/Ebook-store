const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  senderRole: { type: String, enum: ['user', 'admin'], required: true },
  // content is optional to allow image-only replies
  content: { type: String, default: '' },
  imageUrl: { type: String },
  at: { type: Date, default: Date.now },
}, { _id: false });

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, default: 'Support' },
  content: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  replies: { type: [replySchema], default: [] },
}, { timestamps: true });

// Enforce one thread per user
messageSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Message', messageSchema);
