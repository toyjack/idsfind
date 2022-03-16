let  _ = require('lodash');

import INVERTED_IDS_FIRST_LEVEL from '../data/inverted_ids_first_level.json'
import INVERTED_IDS_REMAINING from '../data/inverted_ids_remaining.json'
import INVERTED_IDS_ALL from '../data/inverted_ids_all.json'
import CJKVI_IDS from '../data/cjkvi.json'
import STROKES from '../data/Strokes.json'
import GWIDS from '../data/gw_ids.json'

function intersection(arrs: any[][]) {
  let prev_arr: string[] = arrs[0]
  for (let arr of arrs) {
    prev_arr = prev_arr.filter((x) => arr.includes(x));
  }
  return prev_arr;
}

function strokeCountFilter(results: string[], strokeCount: number): string[] {
  let temp: string[] = []
  for (const result of results) {
    if (STROKES[result] == strokeCount) {
      temp.push(result)
    }
  }
  return temp
}

export function idsfind(termString: string, isDeep?: boolean): string[] {
  let IDS_DATA = {}
  if (isDeep == true) {
    IDS_DATA = INVERTED_IDS_ALL
  } else {
    IDS_DATA = INVERTED_IDS_FIRST_LEVEL
  }
  const strokeCount: any = termString.match(/\d+/g)
  const termIDS: string = termString.replace(/\d+/g, '')
  let remainStrokeCount: number = parseInt(strokeCount)
  let results: string[] = []
  let resultsPool = []

  if (termIDS.length === 1) {
    results = IDS_DATA[termIDS]
  }

  if (termIDS.length > 1) {
    for (const idsPart of termIDS) {
      resultsPool.push(IDS_DATA[idsPart])
    }
    results = intersection(resultsPool)
  }

  if (remainStrokeCount) {
    let termStrokeCount: number = 0
    for (const idsPart of termIDS) {
      let temp: number = +STROKES[idsPart] // for a compiler bug
      termStrokeCount += temp
    }
    const strokeCountForFilter: number = termStrokeCount + remainStrokeCount
    results = strokeCountFilter(results, strokeCountForFilter)
  }

  return results
}

export function getTotalStrokes(char: string): number {
  return STROKES[char]
}

export function getCjkviIDS(char: string): string {
  return CJKVI_IDS[char]
}


export function get_glyphwiki_ids(ids_string: string) {
  let query_list: string[] = []

  if (!ids_string.length) return

  if (ids_string.length < 2) {
    query_list = [ids_string]
  } else {
    const ids_arr: string[] = ids_string.split("")
    for (const ids of ids_arr) {
      let code = ids.codePointAt(0)
      if (code != undefined) {
        const gw_name = "u" + code.toString(16)
        query_list.push(gw_name)  //['u4e00','ua222']
      }
    }
  }

  // const matches = array.filter(value => /^sortOrder=/.test(value));
  let results: string[]=GWIDS
  for (let query of query_list){
    results = results.filter( v=> _.includes(v, query))
  }

  return results
}


// export function search_glyphwiki(ids_string: string) {
//   if (ids_string.length < 2) return
//   let query_list = <string[]>[]
//   const ids_arr: string[] = ids_string.split("")
//   for (const ids of ids_arr) {
//     let code = ids.codePointAt(0)
//     if (code != undefined) {
//       const gw_name = "u" + code.toString(16)
//       query_list.push(gw_name)
//     }
//   }
//   if (query_list.length > 1) {
//     // let combinations = _(query_list).combinations(query_list.length).map(v => _.join(v, '-')).value();
//     // => ['abc', 'abd', 'abe', 'acd', 'ace', 'ade', 'bcd', 'bce', 'bde', 'cde']
//     let permutations = _(query_list).permutations(query_list.length).map(v => _.join(v, '-')).value();
//     // => ['abc', 'acb', 'bac', 'bca', 'cab', 'cba']
//     return permutations
//   } else {
//     return query_list
//   }
// }