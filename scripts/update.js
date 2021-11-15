"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = require("fs");
var sync_1 = __importDefault(require("csv-parse/lib/sync"));
var chalk_1 = __importDefault(require("chalk"));
var UNIHAN_URL = "https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip";
var CHISE_IDS_URL = 'https://gitlab.chise.org/CHISE/ids/-/archive/master/ids-master.zip';
var DOWNLOAD_UNIHAN_TO = 'data/unihan';
var DOWNLOAD_CHISEIDS_TO = 'data/chise-ids';
var DOWNLOAD_OPTIONS = {
    extract: true
};
var CSV_OPTIONS = {
    comment: '#',
    delimiter: '\t',
    skip_empty_lines: true,
    relax_column_count: true
};
var inverted = {};
var depth = 0;
var strokesObj = {};
var idsObj = {};
function isIDC(part) {
    var code = part.codePointAt(0);
    return code >= 0x2ff0 && code <= 0x2fff;
}
function writeOutJsonFile(jsonData, fileName) {
    var jsonStr = JSON.stringify(jsonData);
    (0, fs_1.writeFileSync)(fileName, jsonStr, 'utf-8');
}
function fixSurrogate(idsString) {
    var temp = [];
    for (var i = 0; i < idsString.length; i++) {
        var idsCode = idsString[i].charCodeAt(0);
        if (0xD800 <= idsCode && idsCode <= 0xDBFF) {
            var hi = idsString[i];
            var low = idsString[i + 1];
            temp.push(hi + low);
            i++;
        }
        else {
            temp.push(idsString[i]);
        }
    }
    return temp;
}
function genInverted(ids, hanzi) {
    if (ids[0] == "&") {
        return;
    }
    if (ids.length === 1) {
        return; //　'一':'一'　のようなものを除外
    }
    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
        var idsPart = ids_1[_i];
        if (isIDC(idsPart)) {
            continue;
        }
        if (!inverted[depth]) {
            inverted[depth] = {};
        }
        if (!inverted[depth][idsPart]) {
            inverted[depth][idsPart] = [];
        }
        inverted[depth][idsPart].push(hanzi);
        if (idsObj[idsPart] && idsPart != hanzi) {
            depth++;
            genInverted(idsObj[idsPart], hanzi);
            depth--;
        }
    }
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var content, records, _i, records_1, record, unicodeString, totalStrokes, unicode, chiseFileList, rawChiseData, _a, chiseFileList_1, file, tempData, chiseRecords, _b, chiseRecords_1, record, hanzi, re_sanshofu, re_idc, ids, hanzi, ids, inverted_ids_first_level, inverted_ids_remaining, key;
    return __generator(this, function (_c) {
        console.log(chalk_1["default"].blue('Downloading Unihan database...'));
        // await download(UNIHAN_URL, DOWNLOAD_UNIHAN_TO, DOWNLOAD_OPTIONS);
        if ((0, fs_1.existsSync)(DOWNLOAD_UNIHAN_TO + '/Unihan_IRGSources.txt')) {
            console.log(chalk_1["default"].green('Done!'));
            content = (0, fs_1.readFileSync)(DOWNLOAD_UNIHAN_TO + '/Unihan_IRGSources.txt', 'utf8');
            records = (0, sync_1["default"])(content, CSV_OPTIONS);
            for (_i = 0, records_1 = records; _i < records_1.length; _i++) {
                record = records_1[_i];
                if (record[1] == "kTotalStrokes") {
                    unicodeString = record[0];
                    totalStrokes = record[2];
                    unicode = parseInt(unicodeString.substring(unicodeString.length, 2), 16);
                    strokesObj[String.fromCodePoint(unicode)] = totalStrokes; // strokesObj['一']=1
                }
            }
            writeOutJsonFile(strokesObj, 'data/Strokes.json');
            console.log(chalk_1["default"].blue('Downloading Unihan database...'));
            // await download(CHISE_IDS_URL, DOWNLOAD_CHISEIDS_TO, DOWNLOAD_OPTIONS)
            console.log(chalk_1["default"].green('Done!'));
            chiseFileList = (0, fs_1.readdirSync)(DOWNLOAD_CHISEIDS_TO + '/ids-master');
            rawChiseData = "";
            console.log(chalk_1["default"].blue('Making raw data...'));
            for (_a = 0, chiseFileList_1 = chiseFileList; _a < chiseFileList_1.length; _a++) {
                file = chiseFileList_1[_a];
                if (file.match(/^IDS-UCS-.+/)) {
                    console.log('Found ', file);
                    tempData = (0, fs_1.readFileSync)(DOWNLOAD_CHISEIDS_TO + '/ids-master/' + file, 'utf8');
                    //cut first line
                    //ref https://stackoverflow.com/questions/2528076/delete-a-line-of-text-in-javascript
                    tempData = tempData.substring(tempData.indexOf("\n") + 1);
                    rawChiseData += tempData;
                }
            }
            // writeFileSync(DOWNLOAD_CHISEIDS_TO+'/raw.txt',rawChiseData,'utf-8')
            console.log(chalk_1["default"].green('Done!'));
            chiseRecords = (0, sync_1["default"])(rawChiseData, CSV_OPTIONS);
            for (_b = 0, chiseRecords_1 = chiseRecords; _b < chiseRecords_1.length; _b++) {
                record = chiseRecords_1[_b];
                hanzi = record[1];
                re_sanshofu = /&[^;]+;/g;
                re_idc = /[⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻]/g;
                ids = record[2];
                if (re_sanshofu.test(hanzi)) {
                    continue;
                }
                ids = ids.replace(re_idc, '');
                ids = ids.replace(re_sanshofu, '');
                idsObj[hanzi] = fixSurrogate(ids);
            }
            // writeOutJsonFile(idsObj, 'data/IDS.json')
            console.log(chalk_1["default"].blue("Making inverted IDS data: inverted_ids.json"));
            for (hanzi in idsObj) {
                ids = idsObj[hanzi];
                genInverted(ids, hanzi);
            }
            inverted_ids_first_level = inverted[0];
            inverted_ids_remaining = {};
            for (key in inverted) {
                if (key != "0") {
                    inverted_ids_remaining[key] = inverted[key];
                }
            }
            writeOutJsonFile(inverted_ids_first_level, 'data/inverted_ids_first_level.json');
            writeOutJsonFile(inverted_ids_remaining, 'data/inverted_ids_remaining.json');
            console.log(chalk_1["default"].green("Done"));
        }
        return [2 /*return*/];
    });
}); })();
