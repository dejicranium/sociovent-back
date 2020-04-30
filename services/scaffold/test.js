const ErrorLogger = require('mlar')('errorlogger');
const Errorer = require('mlar')('errorer');
const morx = require('morxv2');
const q = require('q');

// use the app-wide error thrower for Morx as well
// morx.setErrorThrowerFunction(Errorer.throwError);
morx.setErrorThrowerFunction((message) => {
  Errorer.throwError(`Toast: Error: Toast: ${message}`);
});

const spec = morx
  .spec({})
  .build('testParam', 'required:1, eg:1')
  .build('testAmount', 'required:1, eg:1')
  .build('testFee', 'eg:1, eg_highfee:35')
  .build('execId', 'required:1, eg:1, eg_highfee:35')
  .end();

spec.testParam.requireErrorMsg = 'Test Param should be passed';

/**
 * Replace below with your own service implementation
 * @param {*} data
 */
function service(data) {
  const d = q.defer();
  let params = {};

  q.fcall(() => {
    const result = morx.validate(data, spec, { throw_error: false });
    if (!result.noErrors) {
      Errorer.throwError(result.errorMessages, { code: 11 });
    }
    params = result.params;
    if (params.testFee > 20) {
      throw new Error('Fee should not be more than 20');
    }

    return params;
  })
    .then((paramValues) => {
      d.resolve(paramValues);
    })
    .catch((e) => {
      ErrorLogger(e, params.requestId);
      Errorer.handleError(d, e);
    });

  return d.promise;
}

service.morxspc = spec;
module.exports = service;

/* require('mlar')('service_tester')(service, {
    business_name:'Green Berg Inc',
    business_type:'e-commerce',
    email:Date.now()+"@kkk.com",
    password:'12345',
    meta:{collegue:124, debo:3940},
    country:'12345',
    public_key:'12345',
    secret_key:'12345',
    test_public_key:'12345',
    test_secret_key:'12345',
    contact_person:Date.now()+" Alaw",
}, false); */
