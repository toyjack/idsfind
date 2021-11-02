

// const IDS_JSON: IDSOBJ = JSON.parse(readFileSync(IDS_JSON_FILE_PATH, 'utf-8'))
// const STROKES_JSON: STROKEJSON = JSON.parse(readFileSync(STROKES_JSON_FILE_PATH, 'utf-8'))
// const INVERTED_IDS_JSON: ALLINVERTEDIDS = JSON.parse(readFileSync(INVERTED_IDS_FILE_PATH, 'utf-8'))

import INVERTED_IDS from '../data/inverted_ids.json'
import STROKES from '../data/Strokes.json'

function intersection(arrs) {
  let prev_arr = arrs[0]
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
  if (!isDeep) {
    isDeep = false
  }
  const strokeCount: any = termString.match(/\d+/g)
  const termIDS: string = termString.replace(/\d+/g, '')
  let remainStrokeCount: number = parseInt(strokeCount)
  let results: string[] = []
  let resultsPool = []

  if (termIDS.length === 1) {
    results = INVERTED_IDS[0][termIDS]
  }

  if (termIDS.length > 1) {
    for (const idsPart of termIDS) {
      resultsPool.push(INVERTED_IDS[0][idsPart])
    }
  }
  results = intersection(resultsPool)

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