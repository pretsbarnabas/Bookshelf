const fs = require('fs');

const apiKey = process.env.API_URL || 'https://bookshelf.koyeb.app/api';

const config = {
    API_URL: apiKey
};

const path = 'dist/bookshelf/browser/assets/config.json';

fs.writeFileSync(path, JSON.stringify(config, null, 2));

console.log('✅ API Key successfully written to config.json');
