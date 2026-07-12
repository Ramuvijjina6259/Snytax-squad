require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 Syntax Squad API Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}\n`);
  });
};

startServer();
