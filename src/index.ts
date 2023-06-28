import _INVERTED_IDS_ALL from "@/data/inverted_ids_all.json";
import _CJKVI_IDS from "@/data/cjkvi.json";
import _STROKES from "@/data/Strokes.json";
import { IStrokes, CjkviIds, InvertedIdsAll } from "./types";

const INVERTED_IDS_ALL = _INVERTED_IDS_ALL as InvertedIdsAll;
const CJKVI_IDS = _CJKVI_IDS as CjkviIds;
const STROKES = _STROKES as IStrokes;

function intersection(arrs: string[][]) {
  let prev_arr: string[] = arrs[0];
  for (const arr of arrs) {
    prev_arr = prev_arr.filter((x) => arr.includes(x));
  }
  return prev_arr;
}

function strokeCountFilter(results: string[], strokeCount: number): string[] {
  const temp: string[] = [];
  for (const result of results) {
    if (parseInt(STROKES[result]) == strokeCount) {
      temp.push(result);
    }
  }
  return temp;
}

export function idsfind(termString: string): string[] {
  const IDS_DATA = INVERTED_IDS_ALL;
  const strokeCount = termString.match(/\d+/g);
  const termIDS: string = termString.replace(/\d+/g, "");
  const remainStrokeCount = strokeCount ? parseInt(strokeCount[0]) : null;
  let results: string[] = [];
  const resultsPool: string[][] = [];

  if (termIDS.length === 1) {
    results = IDS_DATA[termIDS];
  }

  if (termIDS.length > 1) {
    for (const idsPart of termIDS) {
      resultsPool.push(IDS_DATA[idsPart]);
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
  return parseInt(STROKES[char]);
}

export function getCjkviIDS(char: string): string {
  return CJKVI_IDS[char];
}
