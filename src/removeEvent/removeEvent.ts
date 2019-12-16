/**
 * 移除dom元素监听事件
 * @param element dom元素
 * @param type 事件类型
 * @param handler 需要执行的方法
 */
export default function removeEvent(element: any, type: string, handler: any) {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else if (element.datachEvent) {
    element.detachEvent("on" + type, handler);
  } else {
    element["on" + type] = null;
  }
}
