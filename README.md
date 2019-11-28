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
import * as AoiUtil from "aoi-util";

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
```
