// models/Character.js

import mongoose from 'mongoose';

const comicSchema = new mongoose.Schema({
  characterId: String,
  title: String,
  description: String,
  thumbnail: {
    path: String,
    extension: String,
  },
});

const characterSchema = new mongoose.Schema({
  characterId: String,
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  thumbnail: {
    path: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
    },
  },
  comics: [comicSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.models.Character || mongoose.model('Character', characterSchema);
