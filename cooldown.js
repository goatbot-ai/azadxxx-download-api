const active = new Set();
module.exports = {
  add: (url) => active.add(url),
  has: (url) => active.has(url),
  delete: (url) => active.delete(url)
};
