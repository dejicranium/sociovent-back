const assert = require('assert');
const should = require('chai').should();
const models = require('mlar')('models');
const chai = require('chai');
const service = require('../services/auth/change_password');

const data = {
    old_password: 'intelligent98',
    password: 'newpassword',
    password_confirmation: 'newpassword',
    user: {
        id: 1
    }
}

module.exports =  {
    data,
    mEditUser() {
        return service(module.exports.data);
    },
    
}

describe('#Change Password Service ', function () {

    this.timeout(500000);
    
    it('should change password', function (done) {
        service(data).then(response=> {
            console.log(response)
            response.should.have.a.property('password');
            done()
        }).catch(err=> {
            done(err)
        })
    })
})