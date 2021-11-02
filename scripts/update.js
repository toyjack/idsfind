import { existsSync, readFileSync} from 'fs';
import download from 'download';
import parse from 'csv-parse';
import chalk from 'chalk';


const UNIHAN_URL: string = "https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip"
const CHISE_IDS_FILELIST: string[] = [
  'https://gitlab.chise.org/CHISE/ids/-/raw/master/IDS-UCS-Basic.txt?inline=false',
  'https://gitlab.chise.org/CHISE/ids/-/raw/master/IDS-UCS-Ext-A.txt?inline=false'
];
const DOWNLOAD_TO: string = 'data';
const DOWNLOAD_OPTIONS: any = {
  extract: true
};
const CSV_OPTIONS: any = {
  comment: '#',
  delimiter: '\t'
};

function parser(data: any, options: any) {
  return new Promise((resolve, reject) => {
    parse(data, options, (err, lines) => {
      if (err) reject(err);
      else resolve(lines)
    })
  })
}

(async () => {
  console.log(chalk.blue('Downloading Unihan database...'))
  await download(UNIHAN_URL, DOWNLOAD_TO, DOWNLOAD_OPTIONS);
  if (existsSync('data/Unihan_IRGSources.txt')){
    console.log(chalk.green('Done!'))
    const content = readFileSync('data/Unihan_IRGSources.txt', 'utf8')
    const records= parse(content, CSV_OPTIONS)
    records.map( record => console.log(record) )
  }
})();