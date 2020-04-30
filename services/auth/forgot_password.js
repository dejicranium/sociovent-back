const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const bcrypt = require('bcryptjs');
const excludes = require('../../utils/appvalues');
const obval = require('../../utils/obval');
const validators = require('mlar')('validators');
const tokenUtil = require('../../utils/token')

var spec = morx.spec({})
    .build('identifier', 'required:true, eg:Tina')
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        const params = validParameters.params;
        const selection = {where: {}}
        if (validators.isEmail(params.identifier)){
            selection.where.email  = params.identifier
        }
        else {
            selection.where.username = params.identifier
        }
        return [models.users.findOne(selection), params]
    })
    .spread(async (user, params) => {
        const success_message = "Password reset link sent";
        const token = await tokenUtil.createRandomCharsToken();
        tokenUtil.create('reset_password', user.id, 10, token, false)
        if (!user)  {
            // do nothing
        }
        else  {
            // send reset link
        }
        d.resolve(success_message)
    })
    .catch(err=> {
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;