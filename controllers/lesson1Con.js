const nameRoute = (req, res) => {
  res.send('Hello from lesson 1 controller!');
}

const stanRoute = (req, res) => {
  res.send('Stan Lee says "Hello World!"');
};

module.exports = {
  nameRoute,
  stanRoute
};