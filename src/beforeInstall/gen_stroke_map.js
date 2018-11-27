var fs=require('fs');
var charstroke=require('../../lib/strokes');

var ucs2string = function (unicode) {
    unicode=unicode.substring(unicode.length,2) // U+をとる

	if (unicode >= 0x10000 && unicode <= 0x10FFFF) {
		var hi = Math.floor((unicode - 0x10000) / 0x400) + 0xD800;
		var lo = ((unicode - 0x10000) % 0x400) + 0xDC00;
		return String.fromCharCode(hi) + String.fromCharCode(lo);
	} else {
		return String.fromCharCode(unicode);
	}
};


var mapbmp=[]; //start from 0x3400
var mapsur=[];  // start from 0x20000
//sinica eudc need extra mapping
var maxstroke=0;
for (var i in charstroke) {
	var stroke=parseInt(charstroke[i]);
	var code='0x'+i.substring(i.length,2); // 'U+XXXXX' to 0xXXXXX
	if (code>=0x3400 && code<=0x9FFF ) {
		mapbmp[ code-0x3400 ] = stroke;
	} else if (code>=0x20000 &&  code<=0x2B81F) {
		mapsur[code-0x20000] = stroke;
	}
    if (stroke>maxstroke) maxstroke=stroke;
    console.log(code,stroke)
	
}
var bmpstr="";
for (var i=0;i<mapbmp.length;i++) {
	var sc=mapbmp[i];
	if (typeof(sc)=='undefined') {
		sc=0;
		mapbmp[i]=0;
	}
	bmpstr+=String.fromCharCode(0x23+sc);
}
var surstr="";
for (var i=0;i<mapsur.length;i++) {
	var sc=mapsur[i];
	if (typeof(sc)=='undefined') {
		sc=0;
		mapsur[i]=0;
	}
	surstr+=String.fromCharCode(0x23+sc);
}

for (var i=0;i<mapbmp.length;i++) {
  if ((bmpstr.charCodeAt(i)-0x23 )!==mapbmp[i]) {
	console.log('bmp string conversion error at ',i, bmpstr.charCodeAt(i), mapbmp[i]);
	throw 'string convesion error';
  }
}

console.log('max stroke count ',maxstroke);
console.log('BMP count ',mapbmp.length);
console.log('SUR count ',mapsur.length);

var output="module.exports={";
output+='bmpRLE:"'+bmpstr+'",\r\n';
output+='surRLE:"'+surstr+'"}\r\n';
fs.writeFileSync('lib/strokestr.js',output,'utf8');
console.log('strokestr.js write file down!')