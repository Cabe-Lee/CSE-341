const nameRoute = (req, res) => {
  res.send(`Kazjana Lee says "Hi there!"`);
}

const stanRoute = (req, res) => {
  res.send(`Stan Lee says "Hello World!"`);
};

module.exports = {
  nameRoute,
  stanRoute
};