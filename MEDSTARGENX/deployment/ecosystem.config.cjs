// PM2 Ecosystem Configuration for MEDSTARGENX Backend
module.exports = {
    apps: [
        {
            name: 'medstargenx-backend',
            script: '/var/www/medstargenx/MEDSTARGENX/backend/src/server.js',
            cwd: '/var/www/medstargenx/MEDSTARGENX/backend',
            instances: 1,
            exec_mode: 'cluster',
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            env: {
                NODE_ENV: 'production',
                PORT: 5000,
            },
            error_file: '/var/log/medstargenx/backend-error.log',
            out_file: '/var/log/medstargenx/backend-out.log',
            log_file: '/var/log/medstargenx/backend-combined.log',
            time: true,
            merge_logs: true,
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        },
    ],
};
