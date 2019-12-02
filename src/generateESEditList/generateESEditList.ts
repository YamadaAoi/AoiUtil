import { KeyValue, getFilteredList, judgeMatch } from "../getFilteredList";

/**
 * 保存修改记录为数组
 * @param editList 所有编辑过数据的数组
 * @param editInfo 此次编辑数据的键值对
 * @param originDataList 原始数据的数组[{_id:"",_type:"",_index:"",...}]，请将_source中的数据展开
 * @param matchRule 匹配规则
 * @param addNewData 若原始数据中没有此条记录。是否添加
 */
export function generateESEditList(
  editList: any[],
  editInfo: KeyValue,
  originDataList: any[],
  matchRule: KeyValue[],
  addNewData?: boolean
) {
  let editedOriginDataList: any[] = getFilteredList(originDataList, matchRule);
  if (editedOriginDataList.length > 0) {
    editedOriginDataList.forEach((val: any) => {
      assembleEditList(editList, editInfo, matchRule, val);
    });
  } else if (addNewData) {
    assembleEditList(editList, editInfo, matchRule);
  }
}

function assembleEditList(
  editList: any[],
  editInfo: KeyValue,
  matchRule: KeyValue[],
  originData?: any
) {
  let hasEditInfo: boolean = false;
  if (!editList) {
    editList = [];
  }
  editList.forEach((val: any) => {
    if (Array.isArray(matchRule) && judgeMatch(val, matchRule)) {
      hasEditInfo = true;
      val[editInfo.key] = editInfo.value;
    }
  });
  if (!hasEditInfo && undefined !== matchRule && Array.isArray(matchRule)) {
    let tempEditInfo: any = {};
    matchRule.forEach((val: KeyValue) => {
      tempEditInfo[val.key] = val.value;
    });
    tempEditInfo[editInfo.key] = editInfo.value;
    if (originData) {
      tempEditInfo._id = originData._id;
    }
    editList.push(tempEditInfo);
  }
}
