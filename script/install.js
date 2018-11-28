const download = require('download')
const parse = require('csv-parse')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const gitP = require('simple-git/promise')
const os = require('os')

const unihanUrl = 'https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip'
const dist = 'data/unihan'
const csvOptions = {
  comment: '#',
  delimiter: '\t'
}
const dl_options = {
  extract: true
}
const workPath = path.resolve(__dirname, '../data/chise-ids-git')


download(unihanUrl, dist, dl_options).then(data => {
    console.log(chalk.blue('Downloading Unihan database...'))
    console.log(chalk.green('Done!'))
    return data.find(ele => ele.path == 'Unihan_DictionaryLikeData.txt').data.toString('utf-8')
  })
  .then((data) => {
    return parser(data, csvOptions)
  })
  .then((lines) => {
    let output = new Object()
    for (line of lines) {
      if (line[1] == 'kTotalStrokes') {
        output[line[0]] = line[2]
      }
    }
    return output
  })
  .then(genStrokeMap);

fs.exists('data', (exists) => {
  if (!exists) {
    fs.mkdir('data', (err) => {
      if (err) throw (err);
    })
  }
  console.log(chalk.blue('Downloading CHISE IDS to'), workPath)
  gitP().clone('http://git.chise.org/git/chise/ids.git', workPath)
    .then(genIDSRaw)
    .then(genIDSdata)
})




function genIDSRaw() {
  console.log(chalk.blue('Making raw data...'))
  //read filelist
  let fileListInGit = fs.readdirSync(workPath)
  let rawRawData = ''
  console.log('Making raw.js...')
  for (let file of fileListInGit) {
    if (file.match(/^IDS-UCS-.+/)) {
      // console.log('Found ',file);
      let tempPath = path.resolve(workPath, file)
      let tempData = fs.readFileSync(tempPath, 'utf8')

      //cut first line
      //from https://stackoverflow.com/questions/2528076/delete-a-line-of-text-in-javascript
      tempData = tempData.substring(tempData.indexOf("\n") + 1)
      rawRawData += tempData
    }
  }

  let allLines = rawRawData.split(os.EOL)
  // let out = "module.exports = {" + os.EOL
  let out = new Object()
  for (line of allLines) {
    let arr = line.split('\t')
    if (arr[1]) {
      out[arr[1]] = arr[2]
      // out += '\t\"' + arr[1] + '\":\"' + arr[2] + '\",' + os.EOL
    }
  }

  // out += "}"
  // fs.writeFileSync('data/raw.js', out, 'utf8')
  // console.log(ids_data)
  console.log(chalk.green('Done!'))
  return out
}


let ids_parts = {};
let inverted = [];
let depth = 0;

function genIDSdata(data) {
  if (!fs.existsSync('data/idsdata')) fs.mkdirSync('data/idsdata');

  // - yapcheahshen & toyjack
  // - 24 Mar 2016
  // - z0y/node_modules/idsdata/gen.js

  for (let key in data) {
    let parts = tokenize(data[key]);
    ids_parts[key] = parts;
  }
  for (let key in ids_parts) gen_decompose(key, ids_parts[key]);
  inverted.map(function (decompose, idx) {
    require("fs").writeFileSync("data/idsdata/decompose" + idx + ".js", "module.exports=" + JSON.stringify(decompose, "", " "), "utf8");
  });
  console.log("max decompose depth", inverted.length)
}


function parser(data, options) {
  return new Promise((resolve, reject) => {
    parse(data, options, (err, lines) => {
      if (err) reject(err);
      else resolve(lines)
    })
  })
}


function genStrokeMap(charstroke) {
  // - yapcheahshen
  // - 13 Jun 2015
  // - z0y/node_modules/strokecount/gen.js

  var mapbmp = []; //start from 0x3400
  var mapsur = []; // start from 0x20000
  //sinica eudc need extra mapping
  var maxstroke = 0;
  for (var i in charstroke) {
    var stroke = parseInt(charstroke[i]);
    var code = '0x' + i.substring(i.length, 2); // 'U+XXXXX' to 0xXXXXX
    if (code >= 0x3400 && code <= 0x9FFF) {
      mapbmp[code - 0x3400] = stroke;
    } else if (code >= 0x20000 && code <= 0x2B81F) {
      mapsur[code - 0x20000] = stroke;
    }
    if (stroke > maxstroke) maxstroke = stroke;
    // console.log(code, stroke)

  }
  var bmpstr = "";
  for (var i = 0; i < mapbmp.length; i++) {
    var sc = mapbmp[i];
    if (typeof (sc) == 'undefined') {
      sc = 0;
      mapbmp[i] = 0;
    }
    bmpstr += String.fromCharCode(0x23 + sc);
  }
  var surstr = "";
  for (var i = 0; i < mapsur.length; i++) {
    var sc = mapsur[i];
    if (typeof (sc) == 'undefined') {
      sc = 0;
      mapsur[i] = 0;
    }
    surstr += String.fromCharCode(0x23 + sc);
  }

  for (var i = 0; i < mapbmp.length; i++) {
    if ((bmpstr.charCodeAt(i) - 0x23) !== mapbmp[i]) {
      console.log('bmp string conversion error at ', i, bmpstr.charCodeAt(i), mapbmp[i]);
      throw 'string convesion error';
    }
  }

  console.log('max stroke count ', maxstroke);
  console.log('BMP count ', mapbmp.length);
  console.log('SUR count ', mapsur.length);

  var output = "module.exports={";
  output += 'bmpRLE:"' + bmpstr + '",\r\n';
  output += 'surRLE:"' + surstr + '"}\r\n';
  fs.writeFileSync('data/strokestr.js', output, 'utf8');
  console.log('strokestr.js write file down!')
  return "gen strokes map done!"
}


var isIDC = function (code) {
  // - yapcheahshen
  // - 13 Jun 2015
  // - z0y/node_modules/strokecount/gen.js

  return code >= 0x2ff0 && code <= 0x2fff;
}
var isSurrogate = function (code) {
  // - yapcheahshen
  // - 13 Jun 2015
  // - z0y/node_modules/strokecount/gen.js

  return code >= 0xD800 && code <= 0xDFFF;
}

var tokenize = function (ids) {
  // - yapcheahshen
  // - 13 Jun 2015
  // - z0y/node_modules/strokecount/gen.js

  var i = 0;
  var out = [];
  while (i < ids.length) {
    var c = ids.charCodeAt(i);
    if (!isIDC(c)) {
      if (ids[i] == "&") { //未符号化のをジャンプ
        i++;
        while (i < ids.length && ids[i] != ";") {
          i++;
        }
      } else {
        if (isSurrogate(c)) {
          out.push(ids[i] + ids[i + 1]);
          i++;
        } else { //normal BMP
          out.push(ids[i]);
        }
      }
    }
    i++;
  }
  return out;
}

var gen_decompose = function (glyph, parts) {
  // - yapcheahshen
  // - 13 Jun 2015
  // - z0y/node_modules/strokecount/gen.js

  if (parts.length === 1) return;
  if (!inverted[depth]) {
    inverted[depth] = {};
  }

  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];

    if (glyph[0] != "&") {
      if (!inverted[depth][part]) inverted[depth][part] = "";
      inverted[depth][part] += glyph;
    }

    if (ids_parts[part] && part != glyph) { //work around for u+2c8ab
      depth++;
      gen_decompose(glyph, ids_parts[part]);
      depth--;
    }
  }
}