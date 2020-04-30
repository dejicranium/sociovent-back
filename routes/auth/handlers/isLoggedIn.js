const utils = require('mlar')('mt1l');
const service = require('mlar').mreq('services', 'events/search');
const routemeta = require('mlar')('routemeta');
const auth = require('../../middlewares/auth')

function vinfo(req, res) {
    utils.jsonS(res, {}, 'The process was completed successully');
    
}

vinfo.routeConfig = [{}];
vinfo.routeConfig[0].path = '/isauthenticated';
vinfo.routeConfig[0].method = 'post';
vinfo.routeConfig[0].middlewares = [auth, routemeta('get_events', 'none', ['requestId'])];
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
