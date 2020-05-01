const models = require('mlar')('models');
const jwt = require('jsonwebtoken');
const config = require('../../config')
var utils = require('mlar')('mt1l');
const q = require('q');
const jwt_decode = require('jwt-decode');

module.exports = async function (req, res, next) {
    let auth_token = null;
    let authorization_header = req.headers.authorization;
    console.log(req.headers)

    if (authorization_header) {
        auth_token = authorization_header.split(' ')[1];
    }

    const d = q.defer();
    if (!auth_token) {
        utils.jsonF(res, null, "Access token required");
        return;
    }
    jwt.verify(auth_token, config.JWTsecret, async function (err, decoded) {

        if (err) {
            utils.json401(res, null, "Invalid access token");
            return;
        }
        if (decoded && decoded.expiry < new Date()) {
            utils.json401(res, null, "Expired access token");
            return;
        }

        let decoded_auth_token = jwt_decode(auth_token)

        req.user = decoded_auth_token.user;

        const authtoken = await models.auth_tokens.findOne({
            where: {
                user_id: req.user.id,
                type: 'session',
                token: auth_token
            }
        })
        if (!authtoken) utils.json401(res, null, "Incorrect access token");
        next();
        return;
    });

    return d.promise
}