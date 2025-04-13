const fs = require('fs');

const apiKey = process.env.API_URL || 'http://[::1]:3000/api';
const securityKey = process.env.SECURITY_KEY || 'testKey';

const config = {
    API_URL: apiKey,
    SECURITY_KEY: securityKey
};

const path = 'dist/bookshelf/browser/assets/config.json';

fs.writeFileSync(path, JSON.stringify(config, null, 2));

console.log('✅ API Key successfully written to config.json');
