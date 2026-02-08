module.exports = (mongoose) => {
  const Professional = mongoose.model(
    'professional',
    mongoose.Schema(
      {
        professionalName: String,
        nameLink: {
          firstName: String,
          url: String,
        },
        base64Image: String,
      },
      { timestamps: true }
    )
  );

  return Professional;
};
