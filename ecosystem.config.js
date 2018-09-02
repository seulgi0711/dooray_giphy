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
            watch: true,
            PORT: 3000
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 8080
        }
    }],

    deploy: {
        production: {
            user: 'ubuntu',
            host: 'ec2-52-79-241-73.ap-northeast-2.compute.amazonaws.com',
            ref: 'origin/develop',
            repo: 'https://github.com/seulgi0711/dooray_giphy.git',
            path: '/home/ubuntu/apps/test',
            'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
        }
    }
};