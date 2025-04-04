import mongoose from 'mongoose';

const comicSchema = new mongoose.Schema({
  comicId: String, // Add comicId field to uniquely identify each comic
  title: String,
  description: String,
  thumbnail: {
    path: String,
    extension: String,
  },
  urls: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  saved: { type: Boolean, default: true },
}, {timestamps:true});

export default mongoose.models.Comic || mongoose.model('Comic', comicSchema);
