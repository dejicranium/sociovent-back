const assert = require('assert');
const should = require('chai').should();
const models = require('mlar')('models');
const chai = require('chai');
const service = require('../services/auth/signin');

const data = {
    identifier: 'dejitoye',
    password: 'newpassword',
}

module.exports =  {
    data,
    mSignIn() {
        return service(module.exports.data);
    },
    
}

describe('#SignIn Service ', function () {

    this.timeout(500000);
    
    it('should signin user', function (done) {
        service(data).then(response=> {
            console.log(response)
            response.should.have.a.property('token');
            done()
        }).catch(err=> {
            done(err)
        })
    })
})