const objectLooper = require('mlar')('objectlooper');
const obval = require('./obval');

module.exports = (_obj, _scrubs) => {
  if (typeof _obj !== 'object') return _obj;

  const obj = obval.exclude(['__0__0__0__va']).from(_obj); // to create a copy
  const scrubs = _scrubs || {};

  objectLooper(obj, (prop) => {
    if (scrubs[prop]) {
      obj[prop] = '***MASKED***'; // or we could encrypt
    }
  });

  return obj;
};
