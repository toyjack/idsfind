//

function str2arr(str) {
    //'口人口二' to [ '二', '人', '口', '口' ]
    return Array.from(str).sort();
}

function calarr(arr) { 
    // [ '二', '人', '口', '口' ] to [ '二', '人', '口口' ]
    let prev = "";
    let output = [];
    for (var i = 0; i < arr.length; i++) {
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