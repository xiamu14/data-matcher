export default function supportArray(
  util: Function,
  data: any | any[],
  ...params: any[]
) {
  let res = {};
  if (Array.isArray(data)) {
    res = data.map(item => util(item, ...params));
  } else {
    res = util(data, ...params);
  }
  return res;
}
