# IDSFIND

IDSと画数で漢字を検索するモジュール

[零時字引z0y](https://github.com/g0v/z0y)に基づいて

## Install

```bash
npm install idsfind --save`
```

## Use

Sample: search hanzi which has 口 in its IDS, and stroke which is 5.

```JS
const find  = require('idsfind');
console.log(idsfind('口5',false));
```

## Links

[零時字引z0y](https://github.com/g0v/z0y)

[HDIC Viewer](https://hdic2.let.hokudai.ac.jp)

## License

MIT License.