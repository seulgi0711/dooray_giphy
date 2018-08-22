module.exports = {
  apps: [{
    name: 'DoorayGiphy',
    script: './dist/index.js',
    "ignore_watch": ['node_modules'],
    "watch_options": {
      "followSymlinks": false
    },
    env: {
      NODE_ENV: 'development',
      watch: true
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};