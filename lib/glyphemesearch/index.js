var strokecount=require("../strokecount");
var decomposes=require("../idsdata").decomposes;
var getutf32 = function (opt) { // return ucs32 value from a utf 16 string, advance the string automatically
	if (!opt.widestring) return 0;
	var s = opt.widestring;
	var ic = s.charCodeAt(0);
	var c = 1; // default BMP one widechar
	if (ic >= 0xd800 && ic <= 0xdcff) {
		var ic2 = s.charCodeAt(1);
		ic = 0x10000 + ((ic & 0x3ff) * 1024) + (ic2 & 0x3ff);
		c++; // surrogate pair
	}
	opt.thechar = s.substr(0, c);
	opt.widestring = s.substr(c, s.length - c);
	return ic;
};

var ucs2string = function (unicode) {
    if (unicode >= 0x10000 && unicode <= 0x10FFFF) {
      var hi = Math.floor((unicode - 0x10000) / 0x400) + 0xD800;
      var lo = ((unicode - 0x10000) % 0x400) + 0xDC00;
      return String.fromCharCode(hi) + String.fromCharCode(lo);
    } else {
      return String.fromCharCode(unicode);
    }
};
var str2arr = function(s) {
	var output=[];
	var opt={widestring:s};
	var code=0;
	while (code=getutf32(opt)) {
		output.push(code);
	}
	return output;
}

var getderived = function(part,successor ) {
	var decompose=decomposes[0][part]; //就是不搜索深層
	if (successor){
		for (var i=1;i<decomposes.length;i++) {
			if (decomposes[i][part]) decompose+=decomposes[i][part] ;
		}
	}
	var out=str2arr(decompose);
	if (successor) out.sort(function(a,b){return a-b});
	out.unshift(part.charCodeAt(0)); //加入part到结果第一位
  return out;
}


var remove_once = function(arr) {  // [ 1, 2, 2, 3, 3, 3 ] ==> [ 2, 3, 3]
	  var prev=null;
	  var output=[];
	  for (var i=0;i<arr.length;i++) {
	  	  if (prev===arr[i]) output.push(prev);
	  	  prev=arr[i];
	  }
	  return output;
}  
 var array_unique = function(arr) { //must be sorted array   [ 1, 2, 2, 3, 3, 3 ] ==> [ 1, 2, 3]
 if (!arr.length) return [];
   var ret = [arr[0]];
   for (var i = 1; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
      if (arr[i-1] !== arr[i])  ret.push(arr[i]);
   }
   return ret;
}
var array_intersect = function() { // ( [ 1,2,3]  , [ 2 , 2 , 3] ) ==>  [ 2 , 3]
  if (!arguments.length) return [];
  var a1 = arguments[0];
  var a = arguments[0];
  var a2 = null;
  var n = 1;
  var l,l2,jstart;
  while(n < arguments.length) {
    a = [];
    a2 = arguments[n];
    l = a1.length;
    l2 = a2.length;
    jstart=0;
    for(var i=0; i<l; i++) {
      for(var j=jstart; j<l2; j++) {
        if (a2[j]>a1[i]) break;
        if (a1[i] === a2[j]) a.push(a1[i]);
  		}
      jstart=j;
    }
    a1 = a;
    n++;
  }
  return array_unique(a);
}  

var filterstroke=function(arr,totalstroke) {
	var output=[];
	for (var i=0;i<arr.length;i++) {
		if (strokecount(arr[i])==totalstroke) output.push(arr[i]);
	}
	return output;
}

var moveexta=function(res) { //move extension A after BMP
	var output=[];
	for (var i in res) {
		if (res[i]>=0x4e00 && res[i]<0x9fff) {
			output.push(res[i]);
		}
	}
	for (var i in res) {
		if (res[i]<0x4e00 || res[i]>=0x20000) {
			output.push(res[i]);
		}
	}
	return output;
}

var gsearch=function(wh,successor) { //wh是搜索部件
  var arg=[], derived=[];
  var prev="",glypheme=[];
  var opt={widestring:wh};
  var numbers=wh.match(/\d+/g); //输入的数字的字符串
  var remainstroke=0;

  for (var i in numbers) remainstroke+=parseInt(numbers[i]);//输入的转换成数字

	while (opt.widestring!=="") {
		var code=getutf32(opt);
		if ((code>=0x3400 && code<=0x9fff) ||
			(code>=0x20000 && code<0x2ffff) ||
			(code>=0xe000 && 0xf8ff) )
			glypheme.push(opt.thechar);
	}
   
	if (glypheme.length==0) return [];
	if (glypheme.length==1) {
		var r=getderived(glypheme[0], successor );
		if (remainstroke) {
			var stroke=strokecount(glypheme[0]) + remainstroke;//总笔画数
			return moveexta(filterstroke(r,stroke));
		}
		return  moveexta(r)||[];
	}
	glypheme.sort(); // 口木口木 ==> 口口木木
	var partstroke=0;
	for (var i=0;i<glypheme.length;i++) {
		partstroke+=strokecount(glypheme[i]);
		if (prev===glypheme[i]) { // for searching repeated part
		   derived=remove_once(derived);
		} else {
		   derived=getderived(glypheme[i],successor );
		}
		if (derived==="") return [];
		arg.push( derived );
		prev=glypheme[i];
	}
	var res=array_intersect.apply(null, arg);
	if (remainstroke|| (numbers && numbers.length)) {
		var stroke=partstroke + remainstroke;
		return moveexta(filterstroke(res,stroke));	 
	}
	return moveexta(res);
}

gsearch.getutf32=getutf32;
gsearch.ucs2string=ucs2string;
module.exports=gsearch;