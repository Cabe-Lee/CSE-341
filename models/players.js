module.exports = (mongoose) => {
  const playerSchema = mongoose.Schema(
    {
      // Game character fields
      name: String,
      level: Number,
      strength: Number,
      dexterity: Number,
      constitution: Number,
      intelligence: Number,
      wisdom: Number,
      charisma: Number,
      
      // Authentication fields
      username: { type: String, unique: true, sparse: true },
      email: { type: String, unique: true, sparse: true },
      password: { type: String }, // Hashed password
      oauthProvider: { type: String, enum: ['local', 'google', null], default: null },
      oauthId: { type: String },
      isActive: { type: Boolean, default: true },
      
      // JWT refresh token for remember me
      refreshToken: { type: String },
    },
    { timestamps: true }
  );

  // Remove any existing model to prevent OverwriteModelError
  if (mongoose.models.players) {
    delete mongoose.models.players;
  }

  const Player = mongoose.model('players', playerSchema);

  return Player;
};
