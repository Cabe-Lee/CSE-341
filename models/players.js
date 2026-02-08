module.exports = (mongoose) => {
  const Player = mongoose.model(
    'players',
    mongoose.Schema(
      {
        name: String,
        level: Number,
        strength: Number,
        dexterity: Number,
        constitution: Number,
        intelligence: Number,
        wisdom: Number,
        charisma: Number,
      },
      { timestamps: true }
    )
  );

  return Player;
};
