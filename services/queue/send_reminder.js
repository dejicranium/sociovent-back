const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const moment = require('moment');
const paginate = require('mlar')('paginate');
const send_reminder = require('./send')




function service(event) {
    console.log('send reminder stuff')
    var d = q.defer();
    q.fcall(async () => {
        if (!event) throw new Error("Event not passed")
        if (event.first_reminder_time &&  moment(event.first_reminder_time).diff(moment(), 'days') == 0) {
            try {
                let result = await send_reminder(event);
                console.log(result)
                d.resolve(result)
            }catch(e) {
                console.log(e)
            }
        }
    })
    .catch(err=> {
        console.log(err.stack)
        d.reject(err);
    })

    return d.promise;

}
module.exports = service;