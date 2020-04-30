const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');

var spec = morx.spec({})
    .build('event_id', 'required:true')
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        const params = validParameters.params;
        return [models.events.findOne({where: {id: params.event_id}}), params]
    })
    .spread(async (event, params) => {
        if (!event) throw new Error("Could not find event");
        d.resolve(event.update({is_verified:true}))
    })
    .catch(err=> {
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;