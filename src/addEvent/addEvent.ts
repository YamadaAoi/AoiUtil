/**
 * dom元素监听事件（在事件冒泡阶段执行）
 * @param element dom元素
 * @param type 事件类型
 * @param handler 需要执行的方法
 */
export default function addEvent(element: any, type: string, handler: any) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent(`on${type}`, () => {
      handler.call(element);
    });
  } else {
    element[`on${type}`] = handler;
  }
}
