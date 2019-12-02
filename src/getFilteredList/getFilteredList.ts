export interface KeyValue {
  key: string;
  value: any;
}

/**
 * 匹配规则
 */
export declare type MatchRule = KeyValue[] | ((obj: any) => boolean);

/**
 * 根据过滤条件返回匹配的数据
 * @param dataList 要过滤的数组
 * @param matchRule 匹配规则
 */
export function getFilteredList(dataList: any[], matchRule: MatchRule) {
  let filteredList: any[] = [];
  if (dataList && Array.isArray(dataList) && dataList.length > 0) {
    filteredList = dataList.filter((val: any) => {
      if (typeof matchRule === "function") {
        return matchRule(val);
      } else {
        return judgeMatch(val, matchRule);
      }
    });
  }
  return filteredList;
}

/**
 * 判断是否一致
 * @param data 数据
 * @param matchRule 匹配列表
 */
export function judgeMatch(data: any, matchRule: KeyValue[]) {
  let match: boolean = true;
  if (matchRule && Array.isArray(matchRule) && matchRule.length > 0) {
    matchRule.forEach((val: KeyValue) => {
      if (data[val.key] !== val.value) {
        match = false;
      }
    });
  } else {
    match = false;
  }
  return match;
}
