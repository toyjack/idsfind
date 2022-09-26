import * as _ from "lodash";
import _INVERTED_IDS_ALL from "../data/inverted_ids_all.json";
import _CJKVI_IDS from "../data/cjkvi.json";
import _STROKES from "../data/Strokes.json";
import { IStrokes, CjkviIds, InvertedIdsAll } from "./types";
// import GWIDS from '../data/gw_ids.json'

const INVERTED_IDS_ALL = _INVERTED_IDS_ALL as InvertedIdsAll;
const CJKVI_IDS = _CJKVI_IDS as CjkviIds;
const STROKES = _STROKES as IStrokes;

function intersection(arrs: any[][]) {
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

export function idsfind(termString: string, isDeep = true): string[] {
  const IDS_DATA = INVERTED_IDS_ALL;
  const strokeCount: any = termString.match(/\d+/g);
  const termIDS: string = termString.replace(/\d+/g, "");
  const remainStrokeCount: number = parseInt(strokeCount);
  let results: string[] = [];
  let resultsPool :string[][];

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

// export function get_glyphwiki_ids(ids_string: string) :string[] {
//   let query_list: string[] = []

//   if (!ids_string.length) return

//   if (ids_string.length < 2) {
//     query_list = [ids_string]
//   } else {
//     const ids_arr: string[] = ids_string.split("")
//     for (const ids of ids_arr) {
//       let code = ids.codePointAt(0)
//       if (code != undefined) {
//         const gw_name = "u" + code.toString(16)
//         query_list.push(gw_name)  //['u4e00','ua222']
//       }
//     }
//   }

//   // const matches = array.filter(value => /^sortOrder=/.test(value));
//   let results: string[]=GWIDS
//   for (let query of query_list){
//     results = results.filter( v=> _.includes(v, query))
//   }

//   return results
// }
