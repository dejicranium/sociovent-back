const router = require('express').Router();
const middlewares = require('mlar')('middlewares');
const utils = require('mlar')('mt1l');
const handlers = require('./handlers');

utils.buildRoutes(handlers, middlewares, router);
module.exports = function routesBase(EndpointRouter) {
  EndpointRouter.use('/events', router);
  return EndpointRouter;
};
