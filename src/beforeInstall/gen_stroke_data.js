const download = require('download');
const parse = require('csv-parse')
const fs = require('fs')

const outFile='lib/strokes.js'

global.output='var charstrokemap={\n'; //file head

module.exports=download('https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip', 'lib/unihan', {
    extract: true
}).then(() => {
    console.log('download done!');
    fs.readFile('lib/unihan/Unihan_DictionaryLikeData.txt', 'utf8', (err, data) => {
        if (err) throw err;
        parse(data, {
            comment: '#',
            delimiter: '\t'
        }, function (err, lines) {
            if (err) throw err;
            for (line of lines){
                if (line[1]=='kTotalStrokes'){
                    let temp='\t\''+line[0]+'\':\''+line[2]+'\',\n'
                    global.output+=temp
                }
            }
            global.output+='}'
            fs.writeFile(outFile, global.output, 'utf8', (err,data)=>{
                if(err) throw err;
                console.log('strokes.js write file done')
            });
        })
    });

});