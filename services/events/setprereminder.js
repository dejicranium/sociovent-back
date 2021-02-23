const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const runValidations = require('./validations').create;
const moment = require("moment");
const helpers = require('../../utils/helpers')
const slugify = require('slugify');
const editUser = require('../auth/edit_user');
const sendReminderToSqs = require('../queue/send_reminder');

var spec = morx.spec({})
    .build('session_id', 'required:true')
    .build('event_id', 'required:true, eg:Tina')
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        const params = validParameters.params;

        return models.pre_reminders.findOne({
            where: {
                session_id: params.session_id
            }
        })
    }).then(async preminder=>{
        let p = {};
        if (!preminder) {
            p = await models.pre_reminders.create({
                session_id: data.session_id,
                event_id: data.event_id
            })
        } 
        else {
            p = await preminder.update({
                event_id: data.event_id
            })
        }  
        console.log(p)
        d.resolve(p)

    })
    .catch(err=> {
        console.log(err.stack)
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;

/*
service({
    session_id: '434',
    event_id: 3,
    

})*/