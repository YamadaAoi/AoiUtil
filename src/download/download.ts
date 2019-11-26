/**
 * 下载链接文件
 * @param url 路径
 * @param fileName 文件名
 */
export function download(url: string, fileName?: string) {
  let element = document.createElement("a");
  element.setAttribute("href", url);
  element.setAttribute("target", "_blank");
  element.setAttribute("download", fileName || "");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
