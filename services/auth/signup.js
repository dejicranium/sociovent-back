const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const bcrypt = require('bcryptjs');
const runValidation = require('./validations').signup;

var spec = morx.spec({})
    .build('name', 'required:true, eg:Tina')
    .build('password', 'required:true, eg:tinatona98')
    .build('social_links', 'required:false')
    .build('email', 'required:true')
    .build('username', 'required:true')    
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        let params = validParameters.params;
        
        await runValidation(params);

        params.password = await bcrypt.hash(params.password, 10);

        
        return models.users.create(params)
    })
    .then(user=> {
        if (!user) throw new Error("Could not create user");
        d.resolve(user);
    })
    .catch(err=> {
        /*if (err.errors) {
            err = '';
            err.errors.forEach(e=> {
                if (e.message) {
                    err += e.message + '. ';
                }
            })
        }*/
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;