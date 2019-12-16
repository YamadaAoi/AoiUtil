# AoiUtil

一些常用工具集合

基于 typescript 编写一款前端常用工具集合。

## 示例：

1、安装

```bash
$ npm i aoi-util -D
```

2、使用

```js
import AoiUtil from "aoi-util";

AoiUtil.parseWindD(220);
```

or

```js
import { parseWindD } from "aoi-util";

parseWindD(220);
```

3、支持使用 babel-plugin-import 按需引入方法，在.babelrc 中添加

```js
//（暂不支持 babel-plugin-component，因为本集合没有样式文件，而 babel-plugin-component 必须有样式文件）
{
    "plugins": [
    ["import", { "libraryName": "aoi-util", "camel2DashComponentName": false }]
  ]
}
```

## 方法介绍：

1、parseWindD(wd: number):WindResp

转换 0-360 度为风向，返回一个对象，类型为 WindResp

```js
declare type WindDirection =
  | ""
  | "North"
  | "South"
  | "West"
  | "East"
  | "NorthEast"
  | "SouthEast"
  | "SouthWest"
  | "NorthWest"
  | "Northward"
  | "Southward"
  | "Eastward"
  | "Westward";
interface WindDirectionType {
  name: WindDirection; // 风向
  alias: string; // 中文别名
  symbol: string; // 符号
  centerDegree: number; // 中心角度
}
interface WindResp extends WindDirectionType {
  code: number; // 状态码
  err?: string; // 错误描述
}
```

2、download(url: string, fileName?: string):void

下载一文件，url 为文件路径，fileName 为文件名（非必传）

3、downloadTXT(text: string, filename: string): void

下载一段字符串为一个 txt 文件，text 为文件内容，fileName 为文件名

4、mergeArray(targetArr: any[], arr2merge: any[], relationRule: string | ((targetObj: any, obj2merge: any) => boolean), mapRules: MapRule[], mergeNull?: boolean): MergeResult

特别强调，此方法只支持两个一维数组合并，且数组内对象的子孙对象暂不支持合并

```js
/**
 * 合并结果
 * code:0--合并成功，1--合并失败
 * errMsg:合并详情描述
 * mergedArr:合并后数组
 */
interface MergeResult {
    code: number;
    errMsg: string;
    mergedArr: any[];
}
declare type Type = "array";
/**
 * 将合并数组内多个字段包装成一个对象赋值给to
 * from:合并数组字段
 * rename:重命名
 * mergeNull:是否合并空数据，包括undefined和null
 */
interface FromObj {
    from: string;
    rename?: string;
    mergeNull?: boolean;
}
/**
 * 映射关系
 * from:合并数组字段或多个字段
 * to:被合并数组字段
 * type:合并行为，默认直接赋值，type="array"时，将数据插入以to字段命名的数组
 */
interface MapRule {
    from: string | FromObj[];
    to: string;
    type?: Type;
}
/**
 * 将数据从arr2merge(合并数组)合并到targetArr(被合并数组)
 * @param targetArr 被合并数组
 * @param arr2merge 合并数组
 * @param relationRule 需要进行合并的规则
 * @param mapRules 合并数据字段映射数组
 * @param mergeNull 是否合并空数据，包括undefined和null(仅在MapRule内from字段为字符串时起效)
 */
function mergeArray(targetArr: any[], arr2merge: any[], relationRule: string | ((targetObj: any, obj2merge: any) => boolean), mapRules: MapRule[], mergeNull?: boolean): MergeResult;

/***** 简单版 *****/
// 合并两数组中的部分字段，targetArr为被合并数组，arr2merge为合并数组
let targetArr = [
      { a: '1', b: '2', key: 'same' },
      { a: '3', b: '5', key: 'notsame' },
    ];
let arr2merge = [{ c: '4', key: 'same' }];
let arr = mergeArray(targetArr, arr2merge, 'key', [{ from: 'c', to: 'd' }]);
// mergeArray方法会遍历被合并数组和合并数组，如果relationRule是一个字符串， mergeArray方法会以此字符串为字段名，
// 两数组中此字段一样的数据会进行合并
// 合并后数组应该是 [
//      { a: '1', b: '2', d: '4', key: 'same' },
//      { a: '3', b: '5', key: 'notsame' },
//    ];

/***** 复杂一些 *****/
// 如果情况较复杂，一个字段不足以判断出一一对应关系，relationRule可以传一个方法，此方法必须返回一个boolean值，
// 此方法接收两个对象为参数，分别是被合并数组和合并数组内的对象
// 示意一个以两个参数一致作为判断条件的情况
mergeArray(
  targetArr,
  arr2merge,
  (obj1: any, obj2: any) => {
    if (
      obj1.id === obj2.id &&
      obj1.time === obj2.time
    ) {
      return true;
    } else {
      return false;
    }
  },
  [{ from: 'alias', to: 'name' }]
);

/***** 更复杂一些 *****/
// 如果要将合并数组的多个字段包装成一个对象，合并到被合并数组的to字段中去
// 且以to字段是一个数组
mergeArray(
  targetArr,
  arr2merge,
  (obj1: any, obj2: any) => {
    if (
      obj1.id === obj2.id &&
      obj1.time === obj2.time
    ) {
      return true;
    } else {
      return false;
    }
  },
  [
    {
      from: [
        { from: 'unit' },
        { from: 'type' },
        { from: 'level' },
        { from: 'time' }
      ],
      to: 'content',
      type: 'array',
    },
  ]
);
```

5、esBatch(datasList: any[], editOnly?: boolean, index?: string, type?: string): string;
Elasticsearch 批量操作，此方法仅包含新增和修改
新增和修改，以\_id 是否存在作为依据，datasList 中\_id 存在，则修改，不存在，则新增
index?: string, type?: string 可以不传，但不传要保证 datasList 中每一项内均同时存在\_index 和\_type

```js
//传递给esBatch的数组最好先做处理，只把需要修改或新增的数据传进来
/**
 * 生成 Elasticsearch 批量操作_bulk所需入参
 * @param datasList 数据数组[{_id:"",_type:"",_index:"",...}]
 * @param editOnly 仅进行批量修改
 * @param index 表的_index
 * @param type 表的_type
 */
/**
 *得到的批量请求如下：
  {"update":{"_id":"AgV5tG4BWxRaqJcGopQK","_index":"meteo_surface_all_idx","_type":"MeteoSurfaceAll"}}
  {"doc":{"station":"xxxx","time":"2019-11-29 08:00:00","windSpeed10mAvg":1.6,"rhu":59,"rhuMin":59}}
  {"index":{"_index":"meteo_surface_all_idx","_type":"MeteoSurfaceAll"}}
  {"station":"xxxx","time":"2019-11-29 08:00:00","windSpeed10mAvg":1,"tempMax":2}

 */
```

6、getFilteredList(dataList: any[], matchRule: MatchRule): any[];
按照一定规则返回过滤后的数组，matchRule 可以是一个入参为数组遍历项返回为 boolean 的方法，
也可以是一个键值对数组，getFilteredList 方法会遍历简直对数组比较每一条数据

```js
interface KeyValue {
    key: string;
    value: any;
}
/**
 * 匹配规则
 */
declare type MatchRule = KeyValue[] | ((obj: any) => boolean);
/**
 * 根据过滤条件返回匹配的数据
 * @param dataList 要过滤的数组
 * @param matchRule 匹配规则
 */
function getFilteredList(dataList: any[], matchRule: MatchRule): any[];

// 例子
getFilteredList([{...}], [{ key: 'station', value: "beijing" },{ key: 'time', value: "2019-11-29 08:00:00" }])
or
getFilteredList([{...}], (val:any)=>{
  if ("beijing" === val.station && "2019-11-29 08:00:00" === val.time) {
    return true;
  }else{
    return false;
  }
})
```

7、generateESEditList(editList: any[], editInfo: KeyValue, originDataList: any[], matchRule: KeyValue[], addNewData?: boolean): void;
主要用于前端直接操作 Elasticsearch 时，需要修改数据再保存，暂存所有修改
记录每次修改到 editList 中
matchRule：是匹配条件的键值对，在生成的每条记录中，也会将 matchRule 中的所有项展开到记录中（用于之后编辑匹配）
addNewData：在缺少记录的情况下编辑，是否保存其修改
特别的，若匹配到的原始数据内存在\_id，方法会主动将其存入编辑数组

```js
/**
 * 保存修改记录为数组
 * @param editList 所有编辑过数据的数组
 * @param editInfo 此次编辑数据的键值对
 * @param originDataList 原始数据的数组[{_id:"",_type:"",_index:"",...}]，请将_source中的数据展开
 * @param matchRule 匹配规则
 * @param addNewData 若原始数据中没有此条记录。是否添加
 */
function generateESEditList(editList: any[], editInfo: KeyValue, originDataList: any[], matchRule: KeyValue[], addNewData?: boolean): void;
// 例子：
      generateESEditList(
        editList,
        { key: "rhu", value: 59 },
        originData,
        [
          { key: 'station', value: "xxxx" },
          { key: 'time', value: "2019-11-29 08:00:00" },
        ],
        true
      );
      console.log(editList);
      ---------------------------------------------------------------------------------------
      [{"station":"xxxx","time":"2019-11-29 08:00:00","_id":"AgV5tG4BWxRaqJcGopQK","rhu":59}]
```

8、getHours(hourRangeList: HourRange[]): number[];

```js
/**
 * 时间段，从from到to,from <= to
 */
interface HourRange {
    from: number;
    to: number;
}
/**
 * 返回所有时间段内小时值的并集(0-24):[{from:0,to:6},{from:8,to:9},]-->[0,1,2,3,4,5,6,8,9]
 * @param hourRangeList 时间范围数组
 */
getHours(hourRangeList: HourRange[]): number[];
```

9、addEvent(element: any, type: string, handler: any): void;
拾人牙慧，但是又时不时会用到，补充一下

```js
/**
 * dom元素监听事件（在事件冒泡阶段执行）
 * @param element dom元素
 * @param type 事件类型
 * @param handler 需要执行的方法
 */
function addEvent(element: any, type: string, handler: any): void;
```

10、removeEvent(element: any, type: string, handler: any): void;

```js
/**
 * 移除dom元素监听事件
 * @param element dom元素
 * @param type 事件类型
 * @param handler 需要执行的方法
 */
function removeEvent(element: any, type: string, handler: any): void;
```
