import INVERTED_IDS_FIRST_LEVEL from '../data/inverted_ids_first_level.json'
// import INVERTED_IDS_REMAINING from '../data/inverted_ids_remaining.json'
import INVERTED_IDS_ALL from '../data/inverted_ids_all.json'

import STROKES from '../data/Strokes.json'

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
  if (isDeep==true) {
    IDS_DATA = INVERTED_IDS_ALL
  }else{
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

export function getTotalStrokes(char: string): number{
  return STROKES[char]
}