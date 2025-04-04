import mongoose from 'mongoose';

const entertainmentSchema = new mongoose.Schema({
  entertainmentId: { type: String, required: true },
  type: { type: String, required: true, enum: ['movie', 'tv'] },
  title: String,
  overview: String,
  poster_path: String,
  release_date: String,
  genre_ids: [Number],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  saved: { type: Boolean, default: false },
  trailer_key: { type: String, default: null },
  number_of_seasons: { type: Number, default: 0 },
  number_of_episodes: { type: Number, default: 0 },
  status: String,
  rating: { type: Number } // Add the rating field
}, { timestamps: true });

export default mongoose.models.Entertainment || mongoose.model('Entertainment', entertainmentSchema);
