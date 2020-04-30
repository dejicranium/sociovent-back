const utils = require('mlar')('mt1l');
const service = require('mlar').mreq('services', 'auth/signup');
const routemeta = require('mlar')('routemeta');

function vinfo(req, res) {
  const serviceData = {
    ...req.body,
    ...req.query,
    ...req.headers,
    ...req.params,
  };
  service(serviceData)
    .then((serviceResponse) => {
      utils.jsonS(res, serviceResponse, 'The process was completed successully');
    })
    .catch((serviceError) => {
      utils.jsonF(res, { code: serviceError.code }, serviceError.message);
    });
}

vinfo.routeConfig = [{}];
vinfo.routeConfig[0].path = '/signup';
vinfo.routeConfig[0].method = 'post';
vinfo.routeConfig[0].middlewares = [routemeta('signup', 'none', ['requestId'])];
module.exports = vinfo;

/*
== MULTI METHOD / CONFIG ==
vinfo.routeConfig = [{}, {}];
vinfo.routeConfig[0].path = "/v12";
vinfo.routeConfig[0].method = "post";
vinfo.routeConfig[0].middlewares = ['v1'];
vinfo.routeConfig[1].path = "/v12";
vinfo.routeConfig[1].method = "get";
vinfo.routeConfig[1].middlewares = [];
*/