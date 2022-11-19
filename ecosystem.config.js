module.exports = {
  apps: [
    {
      name: "bitpreco",
      script: "./index.js",
      watch: ["index.js", ".env"],
      node_args: ["-r dotenv/config"],
      // Delay between restart
      watch_delay: 1000,
      ignore_watch: ["node_modules"],
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production", //pm2 [start|restart|stop|delete] ecosystem.config.js
      },
    },
  ],
};
