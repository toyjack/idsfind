var idsfind = require('./dist')

const idsfind_test = idsfind.idsfind("土口2")
// console.log(idsfind_test)

const cjkvi_test = idsfind.getCjkviIDS("刘")
// console.log(cjkvi_test)

const stroke_test = idsfind.getTotalStrokes("刘")
// console.log(stroke_test)


const gw_test = idsfind.get_glyphwiki_ids("田又")
console.log(gw_test)