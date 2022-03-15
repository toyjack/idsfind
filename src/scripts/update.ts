import { existsSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import download from 'download';
import parse from 'csv-parse/lib/sync';
import chalk from 'chalk';
import { mergeWith, isArray } from 'lodash'

interface IDSOBJ {
  [hanzi: string]: string[]
}

interface STOKESOBJ {
  [hanzi: string]: number
}

interface INVERTEDIDS {
  [ids: string]: string[]
}

interface ALLINVERTEDIDS {
  [depth: number]: INVERTEDIDS
}


const UNIHAN_URL: string = "https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip"
const CHISE_IDS_URL: string = 'https://gitlab.chise.org/CHISE/ids/-/archive/master/ids-master.zip';
const DOWNLOAD_UNIHAN_TO: string = 'data/unihan';
const DOWNLOAD_CHISEIDS_TO: string = 'data/chise-ids';
const DOWNLOAD_OPTIONS: any = {
  extract: true
};
const CSV_OPTIONS: any = {
  comment: '#',
  delimiter: '\t',
  skip_empty_lines: true,
  relax_column_count: true,
};

let inverted: ALLINVERTEDIDS = {}
let depth: number = 0;
let strokesObj: STOKESOBJ = {};
let idsObj: IDSOBJ = {};

function isIDC(part: string) {
  let code = part.codePointAt(0)
  return code >= 0x2ff0 && code <= 0x2fff;
}


function writeOutJsonFile(jsonData, fileName) {
  const jsonStr = JSON.stringify(jsonData)
  writeFileSync(fileName, jsonStr, 'utf-8')
}

function fixSurrogate(idsString: string) {
  let temp: string[] = []
  for (let i = 0; i < idsString.length; i++) {
    const idsCode = idsString[i].charCodeAt(0)
    if (0xD800 <= idsCode && idsCode <= 0xDBFF) {
      const hi = idsString[i]
      const low = idsString[i + 1]
      temp.push(hi + low)
      i++
    } else {
      temp.push(idsString[i])
    }
  }
  return temp
}

function genInverted(ids: string[], hanzi: string) {
  if (ids[0] == "&") {
    return
  }

  if (ids.length === 1) {
    return //　'一':'一'　のようなものを除外
  }

  for (const idsPart of ids) {
    if (isIDC(idsPart)) {
      continue
    }
    if (!inverted[depth]) {
      inverted[depth] = {}
    }

    if (!inverted[depth][idsPart]) {
      inverted[depth][idsPart] = []
    }
    inverted[depth][idsPart].push(hanzi)

    if (idsObj[idsPart] && idsPart != hanzi) {
      depth++
      genInverted(idsObj[idsPart], hanzi)
      depth--
    }
  }
}

(async () => {
  console.log(chalk.blue('Downloading Unihan database...'))
  await download(UNIHAN_URL, DOWNLOAD_UNIHAN_TO, DOWNLOAD_OPTIONS);
  if (existsSync(DOWNLOAD_UNIHAN_TO + '/Unihan_IRGSources.txt')) {
    console.log(chalk.green('Done!'))
    const content = readFileSync(DOWNLOAD_UNIHAN_TO + '/Unihan_IRGSources.txt', 'utf8')
    const records = parse(content, CSV_OPTIONS)
    for (let record of records) {
      if (record[1] == "kTotalStrokes") {
        const unicodeString = record[0]
        const totalStrokes = record[2]
        const unicode = parseInt(unicodeString.substring(unicodeString.length, 2), 16)
        strokesObj[String.fromCodePoint(unicode)] = totalStrokes // strokesObj['一']=1
      }
    }
    writeOutJsonFile(strokesObj, 'data/Strokes.json')

    console.log(chalk.blue('Downloading CHISE...'))
    await download(CHISE_IDS_URL, DOWNLOAD_CHISEIDS_TO, DOWNLOAD_OPTIONS)
    console.log(chalk.green('Done!'))
    const chiseFileList = readdirSync(DOWNLOAD_CHISEIDS_TO + '/ids-master')
    let rawChiseData = ""
    console.log(chalk.blue('Making raw data...'))
    for (let file of chiseFileList) {
      if (file.match(/^IDS-UCS-.+/)) {
        console.log('Found ', file);
        let tempData = readFileSync(DOWNLOAD_CHISEIDS_TO + '/ids-master/' + file, 'utf8')
        //cut first line
        //ref https://stackoverflow.com/questions/2528076/delete-a-line-of-text-in-javascript
        tempData = tempData.substring(tempData.indexOf("\n") + 1)
        rawChiseData += tempData
      }
    }
    // writeFileSync(DOWNLOAD_CHISEIDS_TO+'/raw.txt',rawChiseData,'utf-8')
    console.log(chalk.green('Done!'))

    const chiseRecords = parse(rawChiseData, CSV_OPTIONS)
    for (let record of chiseRecords) {
      const hanzi = record[1]
      const re_sanshofu = /&[^;]+;/g
      const re_idc = /[⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻]/g
      let ids = record[2]
      if (re_sanshofu.test(hanzi)) {
        continue
      }
      ids = ids.replace(re_idc, '')
      ids = ids.replace(re_sanshofu, '')
      idsObj[hanzi] = fixSurrogate(ids)
    }
    // writeOutJsonFile(idsObj, 'data/IDS.json')

    console.log(chalk.blue("Making inverted IDS data: inverted_ids.json"))
    for (const hanzi in idsObj) {
      let ids = idsObj[hanzi]
      genInverted(ids, hanzi)
    }
    // console.log(inverted)
    const inverted_ids_first_level = inverted[0]
    let inverted_ids_remaining = {}
    let inverted_ids_all = {}
    for (let key in inverted) {
      if (key != "0") {
        inverted_ids_remaining[key] = inverted[key]
      }
      //merge
      // https://qiita.com/minodisk/items/981c074f12d4d1d7b0d5
      inverted_ids_all = mergeWith(inverted_ids_all, inverted[key]
        , function (a: string[], b:string[]) {
          if (isArray(a) && isArray(b)) {
            return a.concat(b);
          }
        });

    }
    writeOutJsonFile(inverted_ids_first_level, 'data/inverted_ids_first_level.json')
    writeOutJsonFile(inverted_ids_remaining, 'data/inverted_ids_remaining.json')
    writeOutJsonFile(inverted_ids_all, 'data/inverted_ids_all.json')
    console.log(chalk.green("Done"))
  }
})();