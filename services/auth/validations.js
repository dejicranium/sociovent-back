const v = require('../../utils/validators');
const validators = require('mlar')('validators');
const assert = require('mlar')('assertions');
const models = require('mlar')('models');
const { Op } = require('sequelize');


module.exports = {
    async signup(data) {
        assert.emailFormatOnly(data.email);
        assert.lengthGreaterThan(data.first_name, 1, 'First Name')
        assert.lengthGreaterThan(data.last_name, 1, 'Last Name')
        assert.lengthGreaterThan(data.username, 2, 'Username')
        assert.lengthGreaterThan(data.password, 5, 'Password')
        const user = await models.users.findOne({raw: true, where: {
            [Op.or]:[{email: data.email}, {username: data.username}]}});
        
        if (user) {
            if (user.email == data.email) throw new Error("Email already exists");
            throw new Error("Username already exists");
        }

    },
    
    changePassword(data) {
        module.exports.signup(data);
        if (data.old_password == data.password) throw new Error("Old and new password should be different");
    },

    resetPassword(token) {
        if (!token || !token.id) throw new Error("Token doesn't exist");
        if (moment().isAfter(token.expiry)) throw new Error("Token has expired");
        if (token_is_used) throw new Error("Token is already used");
    }
}