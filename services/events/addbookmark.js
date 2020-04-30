const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const runValidations = require('./validations').create;
const moment = require("moment");
const helpers = require('../../utils/helpers')
const slugify = require('slugify');
const uploadImage = require('./uploadimage');


var spec = morx.spec({})
    .build('event_id', 'required:true')
    .build('user', 'required:true, eg:Tina')
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        const params = validParameters.params;
        
        let bookmark = await models.bookmarks.findOne({
            raw: true,
            where: {
                event_id: params.event_id,
                user_id: params.user.id
            }
        })
        
        if (bookmark) throw new Error("Event already bookmarked by user")
       
        bookmark = await models.bookmarks.create({
            event_id: params.event_id,
            user_id: params.user.id
        })
        
        d.resolve(bookmark);
    })
    .catch(err=> {
        console.log(err.stack)
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;

