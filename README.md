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
    ["import", { "libraryName": "aoiu-til", "camel2DashComponentName": false }]
  ]
}
```

## 方法介绍：

1、parseWindD(wd: number)
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
下载一文件，url 为文件路径，fileName 为文件名（未必传）

3、downloadTXT(text: string, filename: string): void
下载一段字符串为一个 txt 文件，text 为文件内容，fileName 为文件名
