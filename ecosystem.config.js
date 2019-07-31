module.exports = {
  apps: [
    {
      name: "DoorayGiphy",
      script: "./dist/index.js",
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
  ],

  deploy: {
    production: {
      user: "ne11243",
      host: "doocon.nhnent.com",
      ref: "origin/develop",
      repo: "https://github.com/seulgi0711/dooray_giphy.git",
      path: "/home1/ne11243/test",
      "post-deploy": "npm install && npm run build"
    }
  }
};
