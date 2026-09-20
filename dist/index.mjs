// node_modules/.pnpm/tsup@7.3.0_ts-node@10.9.2_@_47eda6035733ee1a4958193adca99302/node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// src/index.ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
function loadData(fileName) {
  return JSON.parse(
    readFileSync(join(__dirname, "..", "data", fileName), "utf-8")
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
export {
  getCjkviIDS,
  getTotalStrokes,
  idsfind
};
