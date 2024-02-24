const fs = require('fs').promises;
const path = require('path');

const CONFIG_PATH = '~/.config/stickerswhere/config';

function load(configPath = CONFIG_PATH) {
    console.log('jjj')
    fs.readFile(configPath, 'utf8').then(data => {
        console.log('ccc')
        console.log(data)
    }).catch(err => {
        console.log('eee')
        console.log(err.code)
        if (err.code === 'ENOENT') {
            console.log('rrr')
            return Promise.allSettled([
                fs.mkdir(path.dirname(configPath), {
                    recursive: true
                }).then(() => {
                    console.log('fff')
                    return fs.writeFile(configPath, JSON.stringify({
                        token: null
                    })).catch(err => {
                        console.log(err);
                    });
                }).catch(err => {
                    console.log('qqq')
                    console.log(err);
                })
            ]);
        }
    }).then(() => {
        console.log('ttt')
        return fs.readFile(configPath, 'utf8');
    }).then(data => {
        console.log('ddd')
        console.log(data)
    }).catch(err => {
        console.log('ccc')
        console.log(err)
    });

    return

    // fs.readFile(configPath, (err, data) => {
    //     if (err.code === 'ENOENT') {
    //         fs.mkdir(path.dirname(configPath), err => {
    //             if (err) {
    //                 console.log(err);
    //                 return;
    //             }
    //             fs.writeFile(configPath, JSON.stringify({
    //                 token: null
    //             }), err => {
    //                 if (err) console.log(err);
    //             });
    //         });
    //     } else if (err) {
    //         console.log(err);
    //     }
    // });
}

load();
console.log('lll')

// new Promise((resolve, reject) => {
//     c = 'aaa';
//     console.log(c);
//     setTimeout(() => {
//         console.log(c);
//         resolve(c);
//     }, 1000);
// }).then(v => {
//     if (v === 'aaa') {
//         console.log('bbb')
//         throw 'bbb'
//     }
// }).catch(err => {
//     console.log('ccc')
//     return Promise.allSettled([new Promise((resolve, reject) => {
//         setTimeout(() => {
//             console.log('ddd')
//             resolve('ddd')
//         }, 1000);
//     }).then(() => {
//         setTimeout(() => {
//             console.log('eee')
//         }, 2000);
//         return 'eee2'
//     })]);
// }).then(v => {
//     console.log('fff')
//     console.log(v)
// }).finally(v => {
//     console.log('ggg')
//     console.log(v)
// });