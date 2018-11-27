const chalk=require('chalk')

const genIDS=require('../src/beforeInstall/gen_IDS_data')
const genStroke=require('../src/beforeInstall/gen_stroke_data')
const genStrokeMap=require('../src/beforeInstall/gen_stroke_map')

console.log(chalk.bgKeyword('green')('Install start...'))

genIDS()

genStroke()

genStrokeMap()

console.log(chalk.bgKeyword('green')('All done!'))
