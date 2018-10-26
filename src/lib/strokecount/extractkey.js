var fs=require('fs');

var argv=process.argv;
var sourcepath="./";
argv.shift();argv.shift(); //drop node extactkey.js
var inputfn=argv[0] || sourcepath+"Unihan_DictionaryLikeData.txt";
var thekey=argv[1] || "kTotalStrokes";
var outputfn=argv[2] || thekey+'.json' ;

var arr=fs.readFileSync(inputfn,"utf8").split('\n');
console.time("loop");
var count=0;
var k=0;
var out=[];
for (var i=0;i<arr.length;i++) {
	var p=arr[i].indexOf(thekey);
	if (p==-1) continue;
	
	var unicode=parseInt(arr[i].substr(2,5),16);
	
	var stroke=parseInt(arr[i].substr(p+14));
	
	if (unicode>0x20000) {
		var hi = Math.floor((unicode - 0x10000) / 0x400) + 0xD800;
		var lo = ((unicode - 0x10000) % 0x400) + 0xDC00;
		var ch=String.fromCharCode(hi,lo);
	} else {
		var ch=String.fromCharCode(unicode);
	}
	if (ch.charCodeAt(0) && stroke) out.push('"'+ch+'":'+stroke);
	k++;
	if (k % 10 === 0) {
		out.push('\n');
	}
	//console.log();
}
var output=out.join(",").replace(/,\n/g,'\n');

//output=out.map(function(o){return o.substr(1)})
fs.writeFileSync(outputfn,"{"+output+'}','utf8');
console.timeEnd("loop");
console.log(arr.length,count);