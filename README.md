
# IDSFIND

IDSと画数で漢字を検索するモジュール

[![npm version](https://badge.fury.io/js/idsfind.svg)](https://badge.fury.io/js/idsfind)

## Install

```bash
npm install idsfind
```

## Use

nodejs

```js
const idsfind = require('idsfind')
console.log(idsfind.idsfind('口12'))
console.log(idsfind.idsfind('口12', true)) //search deeply
```

typescript

```js
import {idsfind} from 'idsfind'
console.log(idsfind('口12'))
console.log(idsfind('口12', true)) // search deeply
```

## Build

```bash
npm run build
```

## Update data

```bash
npm run update
```

## References

[文字情報サービス環境CHISE](https://www.chise.org/index.ja.html)

[零時字引z0y](https://github.com/g0v/z0y)

[HDIC Viewer](https://hdic2.let.hokudai.ac.jp)

## License

The MIT License (MIT)
=====================
Copyright © 2022 Guanwei Liu

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
