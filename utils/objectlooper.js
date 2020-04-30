module.exports = function ol(object, callback) {
  const props = Object.keys(object);
  props.forEach((prop) => {
    callback(prop, object[prop]);
  });
};
