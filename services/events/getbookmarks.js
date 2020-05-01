const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const runValidations = require('./validations').create;
const moment = require("moment");
const helpers = require('../../utils/helpers')
const slugify = require('slugify');
const uploadImage = require('./uploadimage');


var spec = morx.spec({})
    .build('user', 'required:true')
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        
        const page = data.page ? parseInt(data.page) : 1;
        const limit = data.limit ? parseInt(data.limit) : 20;
        const offset = page ? (page - 1) * limit : false;

        const params = validParameters.params;
        params.page = page;
        params.limit = limit;


        return models.bookmarks.findAll({ where: {
            user_id: params.user.id
        }, include: [
            {model: models.events, required:true},
            {model: models.users, required:true}]})
        
    })
    .then(resp=> {
        if (!resp)  d.resolve([])
        d.resolve(resp);
    })
    .catch(err=> {
        console.log(err.stack)
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;
