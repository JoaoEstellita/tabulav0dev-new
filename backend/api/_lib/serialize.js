function isTimestamp(x) {
  return x && typeof x === 'object' && typeof x.toDate === 'function';
}
function serialize(value) {
  if (Array.isArray(value)) return value.map(serialize);
  if (value && typeof value === 'object') {
    if (isTimestamp(value)) return value.toDate().toISOString();
    const out = {};
    for (const k of Object.keys(value)) out[k] = serialize(value[k]);
    return out;
  }
  return value;
}
module.exports = { serialize };
