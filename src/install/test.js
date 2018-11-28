
const ids_data={
	"一":"一",
	"丁":"丁",
	"丂":"丂",
	"七":"七",
	"丄":"丄",
	"丅":"丅",
	"丆":"⿱一丿",
	"万":"万",}

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


//

var ids_parts={};
var inverted=[];
var depth=0;
for (var key in ids_data) {
  var parts=tokenize(ids_data[key]);
  ids_parts[key]=parts;
}	
for (var key in ids_parts) gen_decompose(key,ids_parts[key]);
inverted.map(function(decompose,idx){
	require("fs").writeFileSync( "data/idsdata/decompose"+idx+".js", "module.exports="+JSON.stringify(decompose,""," "),"utf8");	
});
console.log("max decompose depth",inverted.length)