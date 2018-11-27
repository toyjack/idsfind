const download = require('download');
const parse = require('csv-parse')
const fs = require('fs')

const outFile = 'data/strokes.js'

global.output = 'exports.charstrokemap={\n'; //file head

exports.downloadStroke = download('https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip', 'data/unihan', {
    extract: true
}).then(() => {
    console.log('download done!');
    fs.readFile('data/unihan/Unihan_DictionaryLikeData.txt', 'utf8', (err, data) => {
        if (err) throw err;
        parse(data, {
            comment: '#',
            delimiter: '\t'
        }, function (err, lines) {
            if (err) throw err;
            for (line of lines) {
                if (line[1] == 'kTotalStrokes') {
                    let temp = '\t\'' + line[0] + '\':\'' + line[2] + '\',\n'
                    global.output += temp
                }
            }
            global.output += '}'
            fs.writeFile(outFile, global.output, 'utf8', (err, data) => {
                if (err) throw err;
                console.log('strokes.js write file done')
            });
        })
    });

});



function ucs2string(unicode) {
    if (unicode >= 0x10000 && unicode <= 0x10FFFF) {
        const hi = Math.floor((unicode - 0x10000) / 0x400) + 0xD800;
        const lo = ((unicode - 0x10000) % 0x400) + 0xDC00;
        return String.fromCharCode(hi) + String.fromCharCode(lo);
    } else {
        return String.fromCharCode(unicode);
    }
}

function trimUnicode(unicode) {
    let head = unicode.trim().substring(0, 2)
    if (head == 'U+') {
        return parseInt(unicode.substring(unicode.length, 2).trim(), 16)
    } else {
        return parseInt(unicode, 16)
    }
}