const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const runValidations = require('./validations').create;
const moment = require("moment");
const helpers = require('../../utils/helpers')
const slugify = require('slugify');
const editUser = require('../auth/edit_user');


var spec = morx.spec({})
    .build('user', 'required:true')
    .build('event_id', 'required:true, eg:Tina')
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        const params = validParameters.params;

       const event = await models.events.findOne({
           where: {
               id: params.event_id
           }
       })

       if (!event) throw new Error("Cannot find event")
       if (event.poster_id != params.user.id) throw new Error("Unauthorized")

       await event.destroy({force:true})


        d.resolve({completed: true});
    })
    .catch(err=> {
        console.log(err.stack)
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;

