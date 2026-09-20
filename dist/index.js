"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  getCjkviIDS: () => getCjkviIDS,
  getTotalStrokes: () => getTotalStrokes,
  idsfind: () => idsfind
});
module.exports = __toCommonJS(src_exports);
var import_node_fs = require("fs");
var import_node_path = require("path");
function loadData(fileName) {
  return JSON.parse(
    (0, import_node_fs.readFileSync)((0, import_node_path.join)(__dirname, "..", "data", fileName), "utf-8")
  );
}
var INVERTED_IDS_ALL = loadData("inverted_ids_all.json");
var CJKVI_IDS = loadData("cjkvi.json");
var STROKES = loadData("Strokes.json");
function intersection(arrs) {
  let prev_arr = arrs[0] ?? [];
  for (const arr of arrs) {
    const current = arr ?? [];
    prev_arr = prev_arr.filter((x) => current.includes(x));
  }
  return prev_arr;
}
function strokeCountFilter(results, strokeCount) {
  const temp = [];
  for (const result of results) {
    if (parseInt(STROKES[result], 10) === strokeCount) {
      temp.push(result);
    }
  }
  return temp;
}
function idsfind(termString) {
  const IDS_DATA = INVERTED_IDS_ALL;
  const strokeCount = termString.match(/\d+/g);
  const termIDS = termString.replace(/\d+/g, "");
  const remainStrokeCount = strokeCount ? parseInt(strokeCount[0], 10) : null;
  let results = [];
  const resultsPool = [];
  if (termIDS.length === 1) {
    results = IDS_DATA[termIDS] ?? [];
  }
  if (termIDS.length > 1) {
    for (const idsPart of termIDS) {
      resultsPool.push(IDS_DATA[idsPart] ?? []);
    }
    results = intersection(resultsPool);
  }
  if (remainStrokeCount) {
    let termStrokeCount = 0;
    for (const idsPart of termIDS) {
      const temp = +STROKES[idsPart];
      termStrokeCount += temp;
    }
    const strokeCountForFilter = termStrokeCount + remainStrokeCount;
    results = strokeCountFilter(results, strokeCountForFilter);
  }
  return results;
}
function getTotalStrokes(char) {
  return parseInt(STROKES[char], 10);
}
function getCjkviIDS(char) {
  return CJKVI_IDS[char];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCjkviIDS,
  getTotalStrokes,
  idsfind
});
