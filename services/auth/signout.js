const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const bcrypt = require('bcryptjs');
const excludes = require('../../utils/appvalues');
const obval = require('../../utils/obval');
const validators = require('mlar')('validators');
const tokenUtil = require('../../utils/token')

var spec = morx.spec({})
    .build('authorization', 'required:false, eg:Tina')
    .build('user', 'required:false, eg:Tina')
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        const params = validParameters.params;
        params.token =   params.authorization.split(' ')[1];
        console.log(params.token)
        if (!params.token || !params.user) {
            d.resolve(true)
        }
        else {
            await models.auth_tokens.destroy({
                force: true,
                where: {
                    user_id: params.user.id,
                    type: 'session',
                    token: params.token
                }
            })
            d.resolve(true)
        }
    })
    .catch(err=> {
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;