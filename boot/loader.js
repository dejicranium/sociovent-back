/**
Boot loader for all handlers
*/
const fs = require('fs');
const path = require('path');

function autoLoadDir(dirNameArg, moduleFilenameArg) {
  /*
  Read it's not okay to modify arguments directly,
  i.e don't do _dirname_ = _dirname_ || "default value"
  better to store in a local variable, then modify local variable
  */
  let dirname = dirNameArg;
  dirname = dirname || __dirname;

  let moduleFileName = moduleFilenameArg;
  moduleFileName = moduleFileName || module.filename;
  const basename = path.basename(moduleFileName);
  const Handlers = {};

  fs.readdirSync(dirname)
    .filter((file) => file !== basename && file !== '.DS_Store')
    .forEach((file) => {
      const handler = file.replace('.js', '');
      // eslint-disable-next-line import/no-dynamic-require,global-require
      Handlers[handler] = require(`${dirname}/${handler}`);
    });

  return Handlers;
}

module.exports = autoLoadDir;
