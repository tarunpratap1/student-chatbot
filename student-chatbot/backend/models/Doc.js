import mongoose from 'mongoose';

const docSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  text: String,
  embeddings: [Number],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Doc', docSchema);
