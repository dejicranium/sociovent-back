const assert = require('assert');
const should = require('chai').should();
const models = require('mlar')('models');
const chai = require('chai');
const service = require('../services/auth/edit_user');

const data = {
    username: 'dejitoye',
    first_name: 'Deji',
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

describe('#Edit User Service ', function () {

    this.timeout(500000);
    
    it('should edit user', function (done) {
        service(data).then(response=> {
            console.log(response)
            response.should.have.a.property('username');
            done()
        }).catch(err=> {
            done(err)
        })
    })
})