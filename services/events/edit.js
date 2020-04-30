const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');

var spec = morx.spec({})
    .build('event_id', 'required:true')
    .build('name', 'required:false')
    .build('description', 'required:false, eg:Tina')
    .build('host_social_handle', 'required:false, eg:tinatona98')  
    .build('host_social_handle_link', 'required:false, eg:tinatona98')  
    .build('venue', 'required:fales, eg:tinatona98')  
    .build('country_origin', 'required:false, eg:tinatona98')  
    .build('start_time', 'required:false, eg:tinatona98')  
    .build('end_time', 'required:false, eg:tinatona98')  
    .build('tags', 'required:false, eg:tinatona98')  
    .build('photo', 'required:false, eg:tinatona98')  
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
        d.resolve(event.update(params))
    })
    .catch(err=> {
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;