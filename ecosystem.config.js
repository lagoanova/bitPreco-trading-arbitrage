module.exports = {
  apps: [
    {
      name: "bitpreco",
      script: "index.js",
      watch: ["index.js", ".env"],
      node_args: ["--require dotenv/config"],
      // Delay between restart
      watch_delay: 1000,
      ignore_watch: ["node_modules"],
    },
  ],
};
