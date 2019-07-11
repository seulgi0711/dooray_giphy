module.exports = {
  apps: [
    {
      name: "DoorayGiphy",
      script: "./dist/src/index.js",
      ignore_watch: ["node_modules"],
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
