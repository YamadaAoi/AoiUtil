declare type Type = "array";

/**
 * 映射关系
 * from:合并数组字段
 * to:被合并数组字段
 * type:合并行为，默认直接赋值，type="array"时，将数据插入以to字段命名的数组
 */
export interface MapRule {
  from: string;
  to: string;
  type?: Type;
}

/**
 * 合并结果
 * code:0--合并成功，1--合并失败
 * errMsg:合并详情描述
 * mergedArr:合并后数组
 */
export interface MergeResult {
  code: number;
  errMsg: string;
  mergedArr: any[];
}

/**
 * 校验是数组且非空
 * @param arr 数组
 */
function validateArr(arr: any) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return true;
  } else {
    return false;
  }
}

/**
 * 判断规则是否是非空字符串或函数
 * @param rule 进行合并的规则
 */
function validateRule(rule: any) {
  if (typeof rule === "string") {
    if ("" === rule) {
      return 1;
    } else {
      return 0;
    }
  } else if (typeof rule === "function") {
    return 2;
  } else {
    return 3;
  }
}

/**
 * 根据"合并数据字段映射数组"合并数据
 * @param targetObj 被合并数组内对象
 * @param obj2merge 合并数组内对象
 * @param mapRules 合并数据字段映射数组
 * @param mergeNull 是否合并空数据，包括undefined和null
 */
function mergeData(
  targetObj: any,
  obj2merge: any,
  mapRules: MapRule[],
  mergeNull?: boolean
) {
  mapRules.forEach((rule: MapRule) => {
    if (mergeNull) {
      doMerge(targetObj, obj2merge, rule);
    } else {
      if (undefined !== obj2merge[rule.from] && null !== obj2merge[rule.from]) {
        doMerge(targetObj, obj2merge, rule);
      }
    }
  });
}

/**
 * 合并数据，根据rule.type区分
 * @param targetObj 被合并数组内对象
 * @param obj2merge 合并数组内对象
 * @param rule 合并数据字段映射
 */
function doMerge(targetObj: any, obj2merge: any, rule: MapRule) {
  if (rule.type === "array") {
    if (targetObj[rule.to] && Array.isArray(targetObj[rule.to])) {
      targetObj[rule.to].push(obj2merge[rule.from]);
    } else {
      targetObj[rule.to] = [];
      targetObj[rule.to].push(obj2merge[rule.from]);
    }
  } else {
    targetObj[rule.to] = obj2merge[rule.from];
  }
}

/**
 * 将数据从arr2merge(合并数组)合并到targetArr(被合并数组)
 * @param targetArr 被合并数组
 * @param arr2merge 合并数组
 * @param relationRule 需要进行合并的规则
 * @param mapRules 合并数据字段映射数组
 * @param mergeNull 是否合并空数据，包括undefined和null
 */
export function mergeArray(
  targetArr: any[],
  arr2merge: any[],
  relationRule: string | ((targetObj: any, obj2merge: any) => boolean),
  mapRules: MapRule[],
  mergeNull?: boolean
) {
  let mergedResult: MergeResult = {
    code: 0,
    errMsg: "success",
    mergedArr: [],
  };
  if (validateArr(targetArr)) {
    mergedResult.code = 1;
    mergedResult.errMsg = "被合并数组为空或非数组";
    return mergedResult;
  }
  if (validateArr(arr2merge)) {
    mergedResult.code = 0;
    mergedResult.errMsg = "合并数组为空或非数组，返回原被合并数组";
    mergedResult.mergedArr = targetArr;
    return mergedResult;
  }
  if (validateArr(mapRules)) {
    mergedResult.code = 0;
    mergedResult.errMsg = "合并规则数组为空或非数组，返回原被合并数组";
    mergedResult.mergedArr = targetArr;
    return mergedResult;
  }
  let ruleType = validateRule(relationRule);
  if (ruleType === 1) {
    mergedResult.code = 0;
    mergedResult.errMsg = "合并规则为空字符串，返回原被合并数组";
    mergedResult.mergedArr = targetArr;
    return mergedResult;
  } else if (ruleType === 3) {
    mergedResult.code = 0;
    mergedResult.errMsg = "合并规则既非字符串也非方法，返回原被合并数组";
    mergedResult.mergedArr = targetArr;
    return mergedResult;
  }
  targetArr.forEach((val: any) => {
    let tempData = { ...val };
    arr2merge.forEach((obj: any) => {
      if (
        tempData &&
        obj &&
        ((typeof relationRule === "string" &&
          tempData[relationRule] === obj[relationRule]) ||
          (typeof relationRule === "function" && relationRule(tempData, obj)))
      ) {
        mergeData(tempData, obj, mapRules, mergeNull);
      }
    });
    mergedResult.mergedArr.push({ ...tempData });
  });
  return mergedResult;
}
