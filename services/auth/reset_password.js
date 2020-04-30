const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const runValidations = require('./validations').resetPassword;
const bcrypt = require('bcryptjs');
const moment = require('moment');
const tokenUtils = require('../../utils/token');

var spec = morx.spec({})
    .build('token', 'required:true')
    .build('new_password', 'required:true')
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        const params = validParameters.params;
        
        const token = await tokenUtils.search(params.token, 'reset_password');
        runValidations(token);

        const user = await models.users.findOne({where: {id: token.user_id}});
        return [user, params]
    })
    .spread(async (user, params) => {
        if (!user) throw new Error("User doesn't exist");
        if (user.status !== 'active') throw new Error("User is not active");
        
        d.resolve(user.update({password: params.new_password}))
    })
    .catch(err=> {
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;