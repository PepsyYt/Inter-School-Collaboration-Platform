const path = require('path');

module.exports = {
  apps: [{
    name: "mongo-server",
    script: path.join(__dirname, "server.js"), // Use absolute path
    watch: true,
    env: {
      NODE_ENV: "development",
      PORT: 3000,
      MONGODB_URI: "mongodb+srv://siddharth20042004:1UqMFPcNNugsQx2g@interschool.2yn66.mongodb.net/?retryWrites=true&w=majority&appName=interschool"
    },
    env_production: {
      NODE_ENV: "production"
    },
    error_file: path.join("C:\\Users\\[USERNAME]\\.pm2\\logs\\", "err.log"),
    out_file: path.join("C:\\Users\\[USERNAME]\\.pm2\\logs\\", "out.log"), 
    log_file: path.join("C:\\Users\\[USERNAME]\\.pm2\\logs\\", "combined.log"),
    time: true,
    autorestart: true,
    instances: 1,
    exec_mode: "fork"
  }]
}