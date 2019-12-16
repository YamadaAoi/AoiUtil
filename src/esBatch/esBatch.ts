/**
 * 判断数据是否为空，包括undefined，null，空字符串
 * @param data 数据
 */
function isNull(data: any) {
  if (undefined === data || null === data || "" === data) {
    return true;
  } else {
    return false;
  }
}

/**
 * 生成 Elasticsearch 批量操作_bulk所需入参
 * @param datasList 数据数组[{_id:"",_type:"",_index:"",...}]
 * @param editOnly 仅进行批量修改
 * @param index 表的_index
 * @param type 表的_type
 */
export default function esBatch(
  datasList: any[],
  editOnly?: boolean,
  index?: string,
  type?: string
) {
  let req: string = "";
  if (datasList.length > 0) {
    datasList.forEach((val: any) => {
      let { _id, _index, _type, ...req2 } = val;
      let req1 = { _id, _index, _type };
      if (isNull(req1._index) || isNull(req1._type)) {
        req1._index = index;
        req1._type = type;
      }
      if (isNull(req1._index) || isNull(req1._type)) {
        console.log("该数据缺少_index或_type，已剔除：", val);
      } else if (editOnly && isNull(req1._id)) {
        console.log("该数据缺少_id，仅修改，已剔除：", val);
      } else {
        req = `${req}${JSON.stringify(
          _id ? { update: req1 } : { index: req1 }
        )}\n${JSON.stringify(
          _id
            ? {
                doc: req2,
              }
            : {
                ...req2,
              }
        )}\n`;
      }
    });
  }
  return req;
}
