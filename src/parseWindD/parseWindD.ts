// 风向偏离中心角度阈值
const WD_THRESHOLD: number = 11.25;

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

// 风向
interface WindDirectionType {
  name: WindDirection;
  // 中文别名
  alias: string;
  // 符号
  symbol: string;
  // 中心角度
  centerDegree: number;
}

interface WindResp extends WindDirectionType {
  code: number;
  err?: string;
}

const WindDirectionList: WindDirectionType[] = [
  {
    name: "North",
    alias: "北风",
    symbol: "N",
    centerDegree: 0,
  },
  {
    name: "Northward",
    alias: "偏北风",
    symbol: "NNE",
    centerDegree: 22.5,
  },
  {
    name: "NorthEast",
    alias: "东北风",
    symbol: "NE",
    centerDegree: 45,
  },
  {
    name: "Eastward",
    alias: "偏东风",
    symbol: "ENE",
    centerDegree: 67.5,
  },
  {
    name: "East",
    alias: "东风",
    symbol: "E",
    centerDegree: 90,
  },
  {
    name: "Eastward",
    alias: "偏东风",
    symbol: "ESE",
    centerDegree: 112.5,
  },
  {
    name: "SouthEast",
    alias: "东南风",
    symbol: "SE",
    centerDegree: 135,
  },
  {
    name: "Southward",
    alias: "偏南风",
    symbol: "SSE",
    centerDegree: 157.5,
  },
  {
    name: "South",
    alias: "南风",
    symbol: "S",
    centerDegree: 180,
  },
  {
    name: "Southward",
    alias: "偏南风",
    symbol: "SSW",
    centerDegree: 202.5,
  },
  {
    name: "SouthWest",
    alias: "西南风",
    symbol: "SW",
    centerDegree: 225,
  },
  {
    name: "Westward",
    alias: "偏西风",
    symbol: "WSW",
    centerDegree: 247.5,
  },
  {
    name: "West",
    alias: "西风",
    symbol: "W",
    centerDegree: 270,
  },
  {
    name: "Westward",
    alias: "偏西风",
    symbol: "WNW",
    centerDegree: 292.5,
  },
  {
    name: "NorthWest",
    alias: "西北风",
    symbol: "NW",
    centerDegree: 315,
  },
  {
    name: "Northward",
    alias: "偏北风",
    symbol: "NNW",
    centerDegree: 337.5,
  },
  {
    name: "North",
    alias: "北风",
    symbol: "N",
    centerDegree: 360,
  },
];

/**
 * 转换 风向(度)
 * @param wd 风向(度)
 */
export function parseWindD(wd: number): WindResp {
  let ret = WindDirectionList.filter(
    item => Math.abs(item.centerDegree - wd) <= WD_THRESHOLD
  );
  return ret.length > 0
    ? { ...ret[0], code: 200 }
    : {
        code: 200,
        err: "转换失败",
        name: "",
        alias: "",
        symbol: "",
        centerDegree: -1,
      };
}
