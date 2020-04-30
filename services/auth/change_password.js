const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const runValidations = require('./validations').changePassword;
const bcrypt = require('bcryptjs');


var spec = morx.spec({})
    .build('user', 'required:true')
    .build('old_password', 'required:true')
    .build('password', 'required:true')
    .build('password_confirmation', 'required:true, eg:Tina')
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        const params = validParameters.params;
        const selection = {where: {id: params.user.id}}
        const userDetails = await models.users.findOne(selection);
        const password_match = await bcrypt.compare(params.old_password, userDetails.password)
        
        if (!password_match) throw new Error("Old password doesn't match current password");
        if (params.old_password == params.password) throw new Error("Old and new password should be different");
        
        runValidations(params);
        
        params.password = await bcrypt.hash(params.password, 10);
        return [userDetails, params]
    })
    .spread(async (user, params) => {
        d.resolve(user.update({password: params.password}));
    })
    .catch(err=> {
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;