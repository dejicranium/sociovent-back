const utils = require('mlar')('mt1l');
const service = require('mlar').mreq('services', 'events/create');
const routemeta = require('mlar')('routemeta');
const auth = require('../../middlewares/auth')
const multiparty = require('multiparty');



function vinfo(req, res) {
 /*
  console.log('*******')
  console.log('*******')
  console.log('*******')
  console.log('*******')
  console.log(req.files.photo)
  console.log('*******')
  console.log('*******')
  console.log('*******')
  console.log('*******')*/


  if (req.files && req.files.photo) {
    req.body.photo = req.files.photo.path;
  }

  console.log('*******')
  console.log('*******')
  console.log('*******')
  console.log('*******')
  console.log(req.body)
  console.log('*******')
  console.log('*******')
  console.log('*******')
  console.log('*******')
  
  const serviceData = {
    ...req.body,
    ...req.query,
    ...req.headers,
    ...req.params,
  };


  serviceData.$user = req.user;

  service(serviceData)
    .then((serviceResponse) => {
      utils.jsonS(res, serviceResponse, 'The process was completed successully');
    })
    .catch((serviceError) => {
      utils.jsonF(res, { code: serviceError.code }, serviceError.message);
    });
}

vinfo.routeConfig = [{}];
vinfo.routeConfig[0].path = '/';
vinfo.routeConfig[0].method = 'post';
vinfo.routeConfig[0].middlewares = [auth, routemeta('create_event', 'none', ['requestId'])];
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
