//判断类型
export function getType(obj) {
  var class2type = {};
  // 生成class2type映射
  "Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function (item) {
    class2type["[object " + item + "]"] = item.toLowerCase();
  });
  if (obj == null) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function"
    ? class2type[Object.prototype.toString.call(obj)] || "object"
    : typeof obj;
}