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
    .build('save_phone', 'required:false, eg:Tina')
    .build('phone', 'required:false, eg:Tina')
    .build('first_reminder_time', 'required:true, eg:Tina')
    .build('second_reminder_time', 'required:false, eg:Tina')
    .build('location', 'required:true, eg:Tina')
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        const params = validParameters.params;
        const acceptableLocations = {
            whatsapp: 1,
            sms: 1,
            google_calendar: 1
        }
        const event = await models.events.findOne({
            where: {
                id: params.event_id
            }
        });

        if (!event) throw new Error("Cannot find event")

        const r = await models.reminders.findOne({
            raw: true,
            where: {
                event_id: params.event_id,
                user_id: params.user.id
            }
        });

        if(r) throw new Error("Reminder has been set already for this event");

        let date = moment(event.start_time).toISOString().split('T')[0];
        if (date) {
            params.first_reminder_time = date + ' ' +   helpers.convert12hourTime(params.first_reminder_time.split(' ')[0], params.first_reminder_time.split(' ')[1]);
            params.second_reminder_time = date + ' ' +  helpers.convert12hourTime(params.second_reminder_time.split(' ')[0], params.second_reminder_time.split(' ')[1]);
        }

        if (!acceptableLocations[params.location])
            throw new Error("Invalid location")
        
        if (params.save_phone && params.phone) {
            editUser({
                user: params.user,
                phone: params.phone
            })

        }
        const reminder = await models.reminders.create({
            user_id: params.user.id,
            event_id: params.event_id,
            first_reminder_time: params.first_reminder_time,
            second_reminder_time: params.second_reminder_time,
            location: params.location,
            phone: params.phone
        })    

        event.update({potential_attendees: event.potential_attendees + 1})
        
        d.resolve(reminder);
    })
    .catch(err=> {
        console.log(err.stack)
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;

