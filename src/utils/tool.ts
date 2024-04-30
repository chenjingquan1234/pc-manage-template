const toolUtil = { getUrlQuery, objToQueryString };
export default toolUtil;

/**
 * 获取url上的参数
 * @returns {object}
 */
function getUrlQuery() {
  const [, query] = location.search.split("?");
  if (!query) return {};
  const queryParams = query
    .split("&")
    .reduce((p: Record<string, string>, c) => {
      const [key, value] = c.split("=");
      p[key] = value;
      return p;
    }, {});
  return queryParams;
}

/**
 * 把对象转成url参数，比如 "a=1&b=2"
 * @returns {object}
 */
function objToQueryString(obj: Record<string, any>): string {
  const queryParams = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      queryParams.push(`${encodedKey}=${encodedValue}`);
    }
  }

  return queryParams.join("&");
}
