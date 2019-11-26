/**
 * 生成txt并下载
 * @param filename
 * @param text
 */
export function downloadTXT(text: string, filename: string) {
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  element.target = "_blank";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
