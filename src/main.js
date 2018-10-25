//
const decomposes=require("../lib/idsdata").decomposes;
const strokecount = require("../lib/strokecount");

function str2arr(str) {
    //'口人口二' to [ '二', '人', '口', '口' ]
    return Array.from(str).sort();
}

function calarr(arr) { 
    // [ '二', '人', '口', '口' ] to [ '二', '人', '口口' ]
    let prev = "";
    let output = [];
    for (let i = 0; i < arr.length; i++) {
        if (prev === arr[i]) {
            output.pop();
            output.push(arr[i] + prev);
        } else {
            output.push(arr[i]);
        }
        prev = arr[i];
    }
    return output;
}

function intersection(arrs){
    let prev_arr=str2arr(arrs[0])
    for(let arr of arrs){
        arr = str2arr(arr)
        prev_arr= prev_arr.filter(x => arr.includes(x));
    }
    return prev_arr;
}

function getderived(hanzi_part,ifSearchDeep ) {
	let decompose=decomposes[0][hanzi_part]; //就是不搜索深層
	if (ifSearchDeep){
		for (let i=1;i<decomposes.length;i++) {
			if (decomposes[i][hanzi_part]) decompose+=decomposes[i][hanzi_part] ;
		}
	}
	let out=str2arr(decompose);
	if (ifSearchDeep) out.sort(function(a,b){return a-b});
	out.unshift(hanzi_part.charCodeAt(0)); //加入part到结果第一位
  return out;
}

//引用開始
function getutf32  (hanzi) { // return ucs32 value from a utf 16 string, advance the string automatically
	let ic = hanzi.charCodeAt(0);
	if (ic >= 0xd800 && ic <= 0xdcff) {
		let ic2 = hanzi.charCodeAt(1);
		ic = 0x10000 + ((ic & 0x3ff) * 1024) + (ic2 & 0x3ff);
		// c++; // surrogate pair
	}
	// thechar = hanzi.substr(0, c);
	// widestring = hanzi.substr(c, s.length - c);
	return ic;
};

let filterstroke = function (arr, totalstroke) {
	let output = [];
	for (let i = 0; i < arr.length; i++) {
		if (strokecount(arr[i]) == totalstroke) output.push(arr[i]);
	}
	return output;
}

let remove_once = function (arr) { // [ 1, 2, 2, 3, 3, 3 ] ==> [ 2, 3, 3]
	let prev = null;
	let output = [];
	for (let i = 0; i < arr.length; i++) {
		if (prev === arr[i]) output.push(prev);
		prev = arr[i];
	}
	return output;
}
//引用おわり


let search = function (parts, successor) {
	let arg = [],
        derived = [],
        prev = ""
    let numbers = parts.match(/\d+/g); //输入的数字的字符串
    parts=parts.replace(/\d+/g,''); //去除数字
    parts=str2arr(parts)
	let remainstroke = 0;

    for (let i in numbers) remainstroke += parseInt(numbers[i]); //输入的转换成数字 "16" to 16

	if (parts.length == 0) return [];
	if (parts.length == 1) {
		let r = getderived(parts[0], successor);
		if (remainstroke) {
			let stroke = strokecount(parts[0]) + remainstroke; //总笔画数
			return filterstroke(r, stroke);
		}
		return r || [];
	}

    let partstroke = 0;
	for (let i = 0; i < parts.length; i++) {
		partstroke += strokecount(parts[i]);
		if (prev === parts[i]) { // for searching repeated part
			derived = remove_once(derived);
		} else {
			derived = getderived(parts[i], successor);
		}
		if (derived === "") return [];
		arg.push(derived);
		prev = parts[i];
	}
	let res = intersection(arg);
	if (remainstroke || (numbers && numbers.length)) {
		let stroke = partstroke + remainstroke;
		return filterstroke(res, stroke);
	}
	return res;
}


// console.log(gsearch("口人3",false))

module.exports=search