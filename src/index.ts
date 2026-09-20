import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CjkviIds, InvertedIdsAll, IStrokes } from "./types";

function loadData<T>(fileName: string): T {
  return JSON.parse(
    readFileSync(join(__dirname, "..", "data", fileName), "utf-8"),
  );
}

const INVERTED_IDS_ALL = loadData<InvertedIdsAll>("inverted_ids_all.json");
const CJKVI_IDS = loadData<CjkviIds>("cjkvi.json");
const STROKES = loadData<IStrokes>("Strokes.json");

function intersection(arrs: string[][]) {
  let prev_arr: string[] = arrs[0] ?? [];
  for (const arr of arrs) {
    const current = arr ?? [];
    prev_arr = prev_arr.filter((x) => current.includes(x));
  }
  return prev_arr;
}

function strokeCountFilter(results: string[], strokeCount: number): string[] {
  const temp: string[] = [];
  for (const result of results) {
    if (parseInt(STROKES[result], 10) === strokeCount) {
      temp.push(result);
    }
  }
  return temp;
}

export function idsfind(termString: string): string[] {
  const IDS_DATA = INVERTED_IDS_ALL;
  const strokeCount = termString.match(/\d+/g);
  const termIDS: string = termString.replace(/\d+/g, "");
  const remainStrokeCount = strokeCount ? parseInt(strokeCount[0], 10) : null;
  let results: string[] = [];
  const resultsPool: string[][] = [];

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
      const temp: number = +STROKES[idsPart]; // for a compiler bug
      termStrokeCount += temp;
    }
    const strokeCountForFilter: number = termStrokeCount + remainStrokeCount;
    results = strokeCountFilter(results, strokeCountForFilter);
  }

  return results;
}

export function getTotalStrokes(char: string): number {
  return parseInt(STROKES[char], 10);
}

export function getCjkviIDS(char: string): string {
  return CJKVI_IDS[char];
}
