const assert = require('assert');
const should = require('chai').should();
const models = require('mlar')('models');
const chai = require('chai');
const signup = require('../services/auth/signup');

const data = {
    username: 'dejitoye',
    password: 'intelligent98',
    password_confirmation: 'intelligent98',
    first_name: "Deji",
    last_name: "Atoyebi",
    email: "itisdeji@gmail.com",

    slack_id: null, 
    trello_id: null,
    jira_id: null,
}

module.exports =  {
    data,
    mSignUp() {
        return signup(module.exports.data);
    },
    
}

describe('#Signup Service ', function () {

    this.timeout(500000);
    
    it('should register user', function (done) {
        signup(data).then(response=> {
            response.should.have.a.property('username');
            response['username'].should.be.equal(data.username);
            done()
        }).catch(err=> {
            done(err)
        })
    })
})