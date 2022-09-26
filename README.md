
# IDSFIND

IDSと画数で漢字を検索するモジュール

Searching Chinese characters by their components and remaining stroke count

[![npm version](https://badge.fury.io/js/idsfind.svg)](https://badge.fury.io/js/idsfind)

## Changelog

### 2.4.0

- Add Ext.H support
- Change to only search only deeply
- Since the json file for GlyphWiki IDS is so big, move and create another module

## Install

```bash
npm install idsfind
```

## Use

nodejs

```js
const idsfind = require('idsfind')
console.log(idsfind.idsfind('口12'))
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

Download data from Unihan, CHISE, CJKVI-IDS and generate new JSON files.

```bash
npm run update
```

## References

[文字情報サービス環境CHISE](https://www.chise.org/index.ja.html)

[零時字引z0y](https://github.com/g0v/z0y)

[HDIC Viewer](https://hdic2.let.hokudai.ac.jp)
