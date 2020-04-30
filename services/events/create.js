const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const runValidations = require('./validations').create;
const moment = require("moment");
const helpers = require('../../utils/helpers')
const slugify = require('slugify');
const uploadImage = require('./uploadimage');


var spec = morx.spec({})
    .build('name', 'required:true')
    .build('description', 'required:true, eg:Tina')
    .build('host_social_handle', 'required:true, eg:tinatona98')  
    .build('host_social_handle_link', 'required:false, eg:tinatona98')  
    .build('venue', 'required:true, eg:tinatona98')  
    .build('country_origin', 'required:true, eg:tinatona98')  
    .build('start_time', 'required:true, eg:tinatona98')  
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
        runValidations(params);
        if (params.social_links) params.social_links = JSON.stringify(params.social_links)
        params.poster_id = data.$user.id;
        params.start_time = params.start_time.split(' ')[0] +' ' +helpers.convert12hourTime(params.start_time.split(' ')[1], params.start_time.split(' ')[2]);
        if (params.photo) {
            params.photo = await uploadImage({photo: params.photo})
        }
        return [models.events.create(params), params]
    })
    .spread(async (event, params) => {
        if (!event) throw new Error("Could not create event");
        if (params.tags) {
            const tags = [];
            params.tags.split(',').forEach(tag => {
                tags.push({tag_name: tag.trim(), event_id: event.id});
            })
            models.event_tags.bulkCreate(tags);
        }
        const slug = slugify(params.name) + '-' + event.id;
        event.update({slug});

        d.resolve(event);
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
    country_origin: "NG",
    description: "ewrwr",
    host_social_handle: "werewrwr",
    host_social_handle_link: "",
    name: "Deji Atoyebi",
    photo: "",
    start_time: "2020-04-22 12:00 AM",
    tags: "something,light,good",
    venue: "Twitter"
})*/