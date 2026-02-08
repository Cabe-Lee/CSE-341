function loadConfig() {
  require('dotenv').config();

  const config = {
    mongodbUri: process.env.MONGODB_URI,
    apiKey: process.env.API_KEY,
    port: process.env.PORT || 8080,
  };

  // Basic validation
  if (!config.mongodbUri) {
    throw new Error('MONGODB_URI is required');
  }
  if (!config.apiKey) {
    throw new Error('API_KEY is required');
  }

  return config;
}

module.exports = { loadConfig };
