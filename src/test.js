var idsfind = require('../dist')

const idsfind_test = idsfind.idsfind("土口2")

const cjkvi_test = idsfind.getCjkviIDS("刘")

const stroke_test = idsfind.getTotalStrokes("刘")

console.log(idsfind_test)
console.log(cjkvi_test)
console.log(stroke_test)