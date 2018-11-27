//
const path = require('path')
const fs = require('fs')
const os = require('os')

const chiseIdsGitUrl = 'http://git.chise.org/git/chise/ids.git'
const libPath = path.resolve(__dirname, './data')
const workPath = path.resolve(__dirname, './data/chise-ids-git')
const genidsPath = "./data/ids_"


const chalk = require('chalk')
console.log(chalk.blue('CHISE IDS data downloading...'))

exports.run=require('simple-git')(libPath).clone(chiseIdsGitUrl, 'chise-ids-git', (err) => {
		if (err) {
			console.log(err)
		}	
		gen()
});



function gen() {
	console.log(chalk.green('Done!'))
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
	let out = "module.exports = {" + os.EOL
	// let ids_data = {}
	for (line of allLines) {
		let arr = line.split('\t')
		if (arr[1]) {
			out += '\t\"' + arr[1] + '\":\"' + arr[2] + '\",' + os.EOL
			// ids_data[arr[1]] = arr[2]
		}
	}

	out += "}"
	fs.writeFileSync('./data/raw.js', out, 'utf8')
	// console.log(ids_data)
	console.log('done')
}


