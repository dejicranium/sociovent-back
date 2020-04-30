const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const moment = require('moment');
const paginate = require('mlar')('paginate');


var spec = morx.spec({})
    .build('event_id', 'required:false')
    .build('search', 'required:false')
    .build('name', 'required:false')
    .build('description', 'required:false, eg:Tina')
    .build('host_social_handle', 'required:false, eg:tinatona98')  
    .build('host_social_handle_link', 'required:false, eg:tinatona98')  
    .build('venue', 'required:fales, eg:tinatona98')  
    .build('country_origin', 'required:false, eg:tinatona98')  
    .build('start_time', 'required:false, eg:tinatona98')  
    .build('poster_id', 'required:false, eg:tinatona98')  
    .build('end_time', 'required:false, eg:tinatona98')  
    .build('tags', 'required:false, eg:tinatona98')  
    .build('photo', 'required:false, eg:tinatona98')  
    .build('similar', 'required:false, eg:tinatona98')  
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        

        const page = data.page ? parseInt(data.page) : 1;
        const limit = data.limit ? parseInt(data.limit) : 20;
        const offset = data.offset ? data.offset : (page - 1) * limit;

        const params = validParameters.params;
        params.page = page;
        params.limit = limit;

        const selection = {where: {}}
        selection.limit = limit;
        selection.offset = offset;

        if (params.similar && params.event_id) {
            const event = await models.events.findOne({ where: {id: params.event_id}});
            
            selection.where.venue = event.venue;
            selection.order = [['potential_attendees', 'desc']];

            return [models.events.findAndCountAll(selection), 'all', params]

        }
        if (params.event_id) {
            selection.where = {id: params.event_id};
            selection.include = [{model: models.users}];
            
            if (params.user) {
                selection.include.push( {
                    model: models.bookmarks, 
                    attributes: ['user_id'], 
                    where: {'user_id': data.user.id}, 
                    required: false
                })
    
                selection.include.push( {
                    model: models.reminders, 
                    attributes: ['user_id'], 
                    where: {'user_id': data.user.id}, 
                    required: false
                })
            }

            return [models.events.findOne(selection), 'one', params]
        }



        if (params.search) {
            selection.where.$or = [
                {
                    name: {
                        $like: "%" + params.search + "%"
                    }
                },
                {
                    description: {
                        $like: "%" + params.search + "%"
                    }
                },
                {
                    host_social_handle: {
                        $like: "%" + params.search + "%"
                    }
                },
                {
                    tags: {
                        $like: "%" + params.search + "%"
                    }
                },
            
            ]
        }

        if (params.name) {
            selection.where.name = {$like: params.name};
        }
        if (params.poster_id) {
            selection.where.poster_id = params.poster_id;
        }
        if (params.description) {
            selection.where.description = {$like: params.description};
        }
        if (params.host_social_handle) {
            selection.where.host_social_handle = params.host_social_handle;
        }
        if (params.venue) {
            selection.where.venue = params.venue;
        }
        if (params.country_origin) {
            selection.where.country_origin = params.country_origin;
        }
        if (params.is_promoted) {
            selection.where.is_promoted = params.is_promoted;
        }
        if (params.is_verified) {
            selection.where.is_verified = params.is_verified;
        }
        if (params.tags) {
            selection.where.is_verified = params.is_verified;
        }
        if (params.to && params.from) {
            let start = moment(moment(params.from).format('YYYY-MM-DD') + ' 00:00:00', moment.ISO_8601);
            let stop = moment(moment(params.to).format('YYYY-MM-DD') + ' 23:59:59', moment.ISO_8601)
            selection.where.start_time.$gte = start;
            selection.where.end_time.$lte = stop;
        }
            
        selection.order = [['id', 'DESC']];
        selection.include = [
            {
                model: models.users
            }, 
          
        ]
        if (params.user) {
            selection.include.push( {
                model: models.bookmarks, 
                attributes: ['user_id'], 
                where: {'user_id': data.user.id}, 
                required: false
            })

            selection.include.push( {
                model: models.reminders, 
                attributes: ['user_id'], 
                where: {'user_id': data.user.id}, 
                required: false
            })
        }
        if (data.offset) {
            selection.offset = null; // we might get an offset from the fronted
            selection.where.id = {$gte: data.offset}
        }

        return [models.events.findAndCountAll(selection), 'all', params]
    })
    .spread(async (resp, resp_type, params) => {
        if(resp_type == 'one') {
            if (!resp) throw new Error("Could not find event");

            d.resolve(resp)
        }
        else {
            if (!resp) {
                d.resolve(paginate([], 'events', 0, params.limit, params.page))
            }
            d.resolve(paginate(resp.rows, 'events', resp.count, params.limit, params.page));
        }
    })
    .catch(err=> {
        console.log(err.stack)
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;