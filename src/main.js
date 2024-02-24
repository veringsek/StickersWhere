const fs = require('fs').promises;
const path = require('path');
const express = require('express');

const CONFIG_PATH = path.join(require('os').homedir(), '.config/stickerswhere/config');
const CONFIG_ENCODING = 'utf8';
const CONFIG_TEMPLATE = {
    app: 'StickersWhere',
    version: '0.0.0',
    port: '8899',
    token: null
};

let config = {};
let server = express();

server.get('/', (req, res) => {
    res.send('kkk')
});

function load(configPath = CONFIG_PATH) {
    return fs.readFile(
        configPath, CONFIG_ENCODING
    ).catch(err => {
        if (err.code === 'ENOENT') {
            return Promise.allSettled([
                fs.mkdir(
                    path.dirname(configPath), { recursive: true }
                ).then(
                    () => fs.writeFile(configPath, JSON.stringify(CONFIG_TEMPLATE), CONFIG_ENCODING)
                )
            ]).then(() => fs.readFile(configPath, CONFIG_ENCODING));
        } else {
            throw err;
        }
    }).then(data => {
        config = JSON.parse(data);
    });
}

load().catch(err => {
    console.log(err);
}).then(() => {
    server.listen(config.port);
    console.log(`${config.app} listening on port ${config.port}.`);
});