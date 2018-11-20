const path =require('path')
const fs= require('fs')
const os = require('os')


const workPath=path.resolve(__dirname,'../IDS_data/chise-ids-git/')
let fileListInGit=fs.readdirSync(workPath)
let rawRawData=''

console.log('Making raw data...')

for (let file of fileListInGit){
  if(file.match(/^IDS-UCS-.+/)){
    let tempPath=path.resolve(workPath,file)
    let tempData=fs.readFileSync(tempPath,'utf8')

    //cut first line
    //from https://stackoverflow.com/questions/2528076/delete-a-line-of-text-in-javascript
    tempData=tempData.substring(tempData.indexOf("\n") + 1)

    rawRawData+=tempData
  }
}
let allLines=rawRawData.split(os.EOL)
let ids_data={}
for(line of allLines){
  let arr=line.split('\t')
  if(arr[1]){
  ids_data[arr[1]]=arr[2]
  }
}

console.log('done')


var isIDC=function(code) {
	return code>=0x2ff0 && code<=0x2fff;
}
var isSurrogate=function(code) {
	return code>=0xD800 && code<=0xDFFF;	
}

var tokenize=function(ids) {
	var i=0;
	var out=[];
	while (i<ids.length) {
		var c=ids.charCodeAt(i);
		if (!isIDC(c)) {
			if (ids[i]=="&") { //未符号化のをジャンプ
				i++;
				while (i<ids.length && ids[i]!=";") {
					i++;
				}
			} else {
				if (isSurrogate(c)) {
					out.push(ids[i]+ids[i+1]);
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

var ids_parts={};

var inverted=[];

var gen_ids_parts=function() {
	for (var key in ids_data) {
		var parts=tokenize(ids_data[key]);
		ids_parts[key]=parts;
	}	
}
var depth=0;
var gen_decompose=function(glyph,parts) {
	if (parts.length===1)  return;
	if (!inverted[depth]) {
		inverted[depth]={};
	}

	for (var i=0;i<parts.length;i++) {
		var part=parts[i];
		
		if (glyph[0]!="&"){
			if (!inverted[depth][part])  inverted[depth][part]="";
			inverted[depth][part]+=glyph;
		}
		
		if (ids_parts[part] && part!=glyph) {//work around for u+2c8ab
			depth++;
			gen_decompose(glyph,ids_parts[part]);
			depth--;
		}
	}	
}

var gen=function() {
	gen_ids_parts();
	for (var key in ids_parts) gen_decompose(key,ids_parts[key]);
}
gen();
inverted.map(function(decompose,idx){
	require("fs").writeFileSync( "../IDS_data/decompose"+idx+".js", "module.exports="+JSON.stringify(decompose,""," "),"utf8");	
});
console.log("max decompose depth",inverted.length)

