/**
 * 时间段，从from到to,from <= to
 */
export interface HourRange {
  from: number;
  to: number;
}

/**
 * 返回所有时间段内小时值的并集(0-24):[{from:0,to:6},{from:8,to:9},]-->[0,1,2,3,4,5,6,8,9]
 * @param hourRangeList 时间范围数组
 */
export default function getHours(hourRangeList: HourRange[]) {
  let hoursList: number[] = [];
  if (
    hourRangeList &&
    Array.isArray(hourRangeList) &&
    hourRangeList.length > 0
  ) {
    hourRangeList.forEach((val: HourRange) => {
      hoursList = hoursList.concat(assembleRange(val));
    });
  }
  if (hoursList.length > 0) {
    hoursList = [...new Set(hoursList)].sort((a: number, b: number) => {
      return a - b;
    });
  }
  return hoursList;
}

/**
 * 检验是否是正确的时间数字
 * @param val 时间值
 */
function hourCheck(val: any) {
  return typeof val === "number" && !isNaN(val) && val >= 0 && val <= 24;
}

/**
 * 检验是否是正确的时间段
 * @param hourRange 时间段
 */
function validateHourRange(hourRange: HourRange) {
  let pass: boolean = false;
  if (
    hourRange &&
    hourCheck(hourRange.from) &&
    hourCheck(hourRange.to) &&
    hourRange.from <= hourRange.to
  ) {
    pass = true;
  } else {
    console.log(`${hourRange}:检验失败，非时间数字或from大于to。`);
  }
  return pass;
}

/**
 * 返回时间段内所有小时值
 * @param hourRange 时间段
 */
function assembleRange(hourRange: HourRange) {
  let allHours: number[] = [];
  if (validateHourRange(hourRange)) {
    for (let i = 0; i < hourRange.to - hourRange.from + 1; i++) {
      let hour = hourRange.from + i;
      if (hour <= hourRange.to) {
        allHours.push(hour);
      }
    }
  }
  return allHours;
}
