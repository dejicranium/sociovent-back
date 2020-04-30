const assert = require('assert');
const should = require('chai').should();
const models = require('mlar')('models');
const chai = require('chai');
const service = require('../services/events/create');

const data = {
    name: 'Eldee discovery',
    description: 'Something good',
    venue: 'facebook',
    host_social_handle: 'cranium',
    country_origin: 'NGN',
    start_time: '2020-04-03 23:50:11',
    
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

describe('#Create Events Service ', function () {

    this.timeout(500000);
    
    it('should create events', function (done) {
        service(data).then(response=> {
            console.log(response)
            response.should.have.a.property('name');
            done()
        }).catch(err=> {
            done(err)
        })
    })
})