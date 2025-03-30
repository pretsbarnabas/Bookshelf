const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'src/assets/config.json');

const configData = {
    API_URL: "http://[::1]:3000/api"
};

const jsonData = JSON.stringify(configData, null, 2);

fs.writeFile(configPath, jsonData, (err) => {
    if (err) {
        console.error('❌ Error writing config.json:', err);
    } else {
        console.log('✅ config.json generated successfully in src/assets/');
    }
});
