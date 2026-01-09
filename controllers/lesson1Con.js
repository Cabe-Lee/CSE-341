const nameRoute = (req, res) => {
  res.send(`Kazjana Lee, my wife, says "Hi there!"`);
}

const stanRoute = (req, res) => {
  res.send(`Stan Lee (yes, the creator of Spider-Man) says "Hello World!"`);
};

module.exports = {
  nameRoute,
  stanRoute
};