module.exports = {
  apps: [
    {
      name: "DoorayGiphy",
      script: "./dist/index.js",
      ignore_watch: ["node_modules"],
      watch: ["dist"],
      watch_options: {
        followSymlinks: false
      },
      env: {
        NODE_ENV: "development",
        watch: true,
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 10145
      }
    }
  ]
};
