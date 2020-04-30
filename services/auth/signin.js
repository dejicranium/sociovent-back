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
    .build('password', 'required:true, eg:tinatona98')  
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
        if (!user) throw new Error("Invalid credentials");
        const password_match = await bcrypt.compare(params.password, user.password)
        if (!password_match) throw new Error("Invalid credentials");
        if (user.status) throw new Error("User is not active");
        delete user.password
        const jwtoken = await tokenUtil.createJwtToken({
            user
        })
        const new_token = await tokenUtil.create('session', user.id, 1000, jwtoken, false)
        const resp = {
            token: new_token.token
        }

        d.resolve(resp);
    })
    .catch(err=> {
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;