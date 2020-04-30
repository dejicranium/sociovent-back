function select(props) {
  function from(_object) {
    const object = _object || {};
    const newObject = {};
    props.forEach((prop) => {
      newObject[prop] = object[prop];
    });
    return newObject;
  }
  return {
    from,
  };
}

function exclude(props) {
  function from(_object) {
    const object = _object || {};
    const newObject = {};
    const excludeDict = {};
    props.forEach((prop) => {
      // create a lookup for props to exclude
      excludeDict[prop] = 1;
    });
    Object.keys(object).forEach((key) => {
      // If prop is not in exclude lookup, add to new object
      if (!excludeDict[key]) {
        newObject[key] = object[key];
      }
    });
    return newObject;
  }
  return {
    from,
  };
}

module.exports = {
  select,
  exclude,
};
