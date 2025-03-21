const fs = require('fs');

const apiKey = process.env.API_URL || 'http://[::1]:3000/api';

const config = {
    apiKey: apiKey
};

const path = 'dist/frontend/browser/assets/config.json';

fs.writeFileSync(path, JSON.stringify(config, null, 2));

console.log('✅ API Key successfully written to config.json');
