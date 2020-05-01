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
        //utils.jsonF(res, null, "Access token required");
        next();
    }
    jwt.verify(auth_token, config.JWTsecret, function (err, decoded) {

        if (err) {
           // utils.json401(res, null, "Invalid access token");
            next();
        }
        if (decoded && decoded.expiry < new Date()) {
           // utils.json401(res, null, "Expired access token");
            next();
        }

        let decoded_auth_token = jwt_decode(auth_token)

        req.user = decoded_auth_token.user;
        next();
        return;
    });

    return d.promise
}