module.exports = (mongoose) => {
  const Contact = mongoose.model(
    'contacts',
    mongoose.Schema(
      {
        firstName: String,
        lastName: String,
        email: String,
        favoriteColor: String,
        birthday: String,
      },
      { timestamps: true }
    )
  );

  return Contact;
};
