const assert = require('assert');
const should = require('chai').should();
const models = require('mlar')('models');
const chai = require('chai');
const service = require('../services/auth/forgot_password');

const data = {
    identifier: 'itisdeji@gmail.com',
}

module.exports =  {
    data,
    mForgotPassword() {
        return service(module.exports.data);
    },
    
}

describe('#Change Password Service ', function () {

    this.timeout(500000);
    
    it('should forget password', function (done) {
        service(data).then(response=> {
            console.log(response)
            response.should.be.equal('Password reset link sent');
            done()
        }).catch(err=> {
            done(err)
        })
    })
})