const logger = require('mlar')('logger');

module.exports = function routemetaMiddleware(
  routename,
  routescopelevel,
  hashFields,
  enforceHashChecks,
) {
  return (req, res, next) => {
    // default bank id. Set to different values accross all instances deployed
    req.body.bankId = process.env.BANK_ID || 1;
    // routename is used to audit a route for permissions
    req.routename = routename;
    // routescopelevel is used to determine
    // whether a dev's api key is
    // required for auth or bank user's secret
    // possible values: dev | user
    req.routescopelevel = routescopelevel;
    req.hashFields = hashFields;
    req.enforceHashChecks = enforceHashChecks;

    if (req.headers.requestid) {
      req.body.requestId = req.headers.requestid;
    }

    logger([routename, routescopelevel, hashFields]);
    next();
  };
};
