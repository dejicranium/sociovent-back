const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const runValidations = require('./validations').signup;

var spec = morx.spec({})
    .build('user', 'required:false')
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        const params = validParameters.params;
        const selection = {where: {id: params.user.id}, attributes: {exclude: ['password']}}
        return [models.users.findOne(selection), params]
    })
    .spread(async (user, params) => {
        if (!user) throw new Error("Invalid credentials");
        let s = user;
        s.social_links = JSON.parse(s.social_links);
        d.resolve(s);
    })
    .catch(err=> {
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;