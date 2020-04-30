const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const runValidations = require('./validations').signup;

var spec = morx.spec({})
    .build('user', 'required:false')
    .build('name', 'required:false, eg:Tina')
    .build('username', 'required:false, eg:tinatona98')  
    .build('social_links', 'required:false, eg:tinatona98')  
    .build('phone', 'required:false, eg:tinatona98')  
    .build('email', 'required:false, eg:tinatona98')  
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        const params = validParameters.params;
        runValidations(params);
        const selection = {where: {id: params.user.id}}
        return [models.users.findOne(selection), params]
    })
    .spread(async (user, params) => {
        if (!user) throw new Error("Invalid credentials");
        await user.update(params);
        d.resolve(user);
    })
    .catch(err=> {
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;