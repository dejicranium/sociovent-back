const models = require('mlar')('models');
const moment = require('moment');
const config = require('../config')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

async function createJwtToken(params) {
    return await jwt.sign(params,
        config.JWTsecret,
        {
          expiresIn: config.JWTexpiresIn
        }
      );
}
async function createRandomCharsToken() {
    return await crypto.randomBytes(32).toString('hex');
}

async function search(token, type=null) {
    const selection = {where: {token, type}};
    return await models.auth_tokens.findOne(selection);
}


async function create(type, user_id, expiry_in_minutes=10, token, allow_duplicate=false) {
    expiry_in_minutes = moment().add(expiry_in_minutes, 'minutes');
    let params = {
        type, 
        user_id,
        token,
        expiry: expiry_in_minutes,
    }
    if (!allow_duplicate) {
        return await models.auth_tokens.findOne({
            where:{
                type,
                user_id
            }
        }).then(token=> {
            if (!token) {
                return models.auth_tokens.create(params);
            }
            else {
                token.token = params.token;
                token.expiry = expiry_in_minutes
                token.save()
                token.reload();
                return token
            }
        }).catch(err=> {
            throw new Error("Could not create token. Reason" + err.message)
        })
    }
    else {
        return await models.auth_tokens.create(params).then(token=> {
           return token
        }).catch(err=> {
            throw new Error("Could not create token. Reason" + err.message)
        })
    }
}
    

module.exports = {
    createJwtToken,
    createRandomCharsToken,
    create,
    search
}