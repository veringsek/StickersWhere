const fs = require('fs').promises;
const path = require('path');

const CONFIG_PATH = '~/.config/stickerswhere/config';
const CONFIG_ENCODING = 'utf8';
const CONFIG_TEMPLATE = {
    token: null
};

let config = {};

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
});