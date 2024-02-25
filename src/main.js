const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const TelegramBot = require('node-telegram-bot-api');

const CONFIG_PATH = path.join(require('os').homedir(), '.config/stickerswhere/config');
const CONFIG_ENCODING = 'utf8';
const CONFIG_TEMPLATE = {
    app: 'StickersWhere',
    version: '0.0.0',
    port: '8899',
    privatekey: './private.pem',
    certificate: './cert.pem',
    token: null
};

let config = {};
let privatekey = null;
let certificate = null;
let server = express();

function load(configPath = CONFIG_PATH) {
    let configFolder = path.dirname(configPath);
    return fs.readFile(
        configPath, CONFIG_ENCODING
    ).catch(err => {
        if (err.code === 'ENOENT') {
            return Promise.allSettled([
                fs.mkdir(
                    configFolder, { recursive: true }
                ).then(
                    () => fs.writeFile(configPath, JSON.stringify(CONFIG_TEMPLATE), CONFIG_ENCODING)
                )
            ]).then(() => fs.readFile(configPath, CONFIG_ENCODING));
        } else {
            throw err;
        }
    }).then(data => {
        config = JSON.parse(data);
        return fs.readFile(path.join(configFolder, config.privatekey), CONFIG_ENCODING);
    }).then(data => {
        privatekey = data;
        return fs.readFile(path.join(configFolder, config.certificate), CONFIG_ENCODING);
    }).then(data => {
        certificate = data;
    });
}

server.use(bodyParser.json());

server.get('/', (req, res) => {
    res.send(`${config.app} listening on port ${config.port}.`);
});

load().catch(err => {
    console.log(err);
}).then(() => {
    https.createServer({
        key: privatekey, 
        cert: certificate
    }, server).listen(config.port, () => {
        console.log(`${config.app} listening on port ${config.port}.`);
    });
});