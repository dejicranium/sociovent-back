const q = require('q');
const objectLooper = require('mlar')('objectlooper');

// const describe = test; //function describeStub() {};
// const it = test;

// Todo here would be to make sure we can specify the condiitons for e.g.s to work
// or better still remove support for egs or state tha egs should work only
// with rejects or are expected only to be rejected

function extractSpecialData(obj) {
  const specialdata = [];

  if (!obj || typeof obj !== 'object') {
    return specialdata;
  }

  objectLooper(obj, (prop) => {
    if (/^eg_/.test(prop)) {
      specialdata.push({ name: prop.split('eg_')[1], value: obj[prop] });
    }
  });

  return specialdata;
}

/*
Todo:
Write tests.

How does one write mocha test to test a mocha test creating service?
How does one test that the test of a test is correct?

Do you know? 🤔🤔
*/

// extract params
// todo: Handle mapped params
/*
Todo: How do we determine how to assert special case values?
Idea I:
id:{ required:true, eg:"89", eg_invalid:"ab", eg_alreadyexists:{value:"20", throw:false} }
throw set to false means, if we use special value 20 for id, we expect call to service
function not to throw an error.
*/
function extractParamsFromSpec(spec) {
  const allParams = {};
  const requiredParams = {};
  const requiredParamsList = [];
  const notRequiredParams = {};
  const notRequiredParamsList = [];
  const specialCases = [];

  objectLooper(spec, (param) => {
    const specParam = spec[param];
    if (specParam.eg) {
      allParams[param] = specParam.eg;
      specialCases.push({ param, values: extractSpecialData(specParam) });
      if (specParam.required) {
        requiredParams[param] = specParam.eg;
        requiredParamsList.push(param);
      } else {
        notRequiredParams[param] = specParam.eg;
        notRequiredParamsList.push(param);
      }
    }
  });

  return {
    allParams,
    requiredParams,
    requiredParamsList,
    notRequiredParamsList,
    notRequiredParams,
    specialCases,
  };
}

// Sample config stuff
// ({
//   doRequiredTest: true,
//   doValueTest: true,
//   doInvalidValueTest: true,
//   serviceUsesPromises: false,
//   serviceUsesCallbacks: true,
// });

function describeThis(serviceSpec, serviceMethod, configArg, rawCallback) {
  function errTestDelegate(data) {
    return function errTest() {
      serviceMethod(data);
    };
  }

  // function errTestPromiseDelegate(data, done, message) {
  //   return serviceMethod(data).then((new_user) => {
  //     expect(new_user).to.be.rejectedWith(message);
  //   });
  // }

  // Run validation test
  const config = configArg;
  const opData = extractParamsFromSpec(serviceSpec);
  const { specialCases } = opData;

  config.run_only = config.run_only || 'both';
  describe(config.TestName, () => {
    if (['both', 'morx'].indexOf(config.run_only) >= 0) {
      const reqParams = opData.requiredParamsList;
      const nreqParams = opData.notRequiredParamsList;

      // Test for required value errors
      reqParams.forEach((p) => {
        const data = JSON.parse(JSON.stringify(opData.allParams));
        delete data[p];
        it(`should throw error ${p} is required error`, () => {
          if (config.IsPromiseMethod) {
            return expect(serviceMethod(data)).rejects.toThrow();
          }

          expect(errTestDelegate(data)).toThrow();
          return null;
        });
      });

      // Test for each non-required param
      nreqParams.forEach((p) => {
        it(`should run successfully for non-required param ${p}`, () => {
          if (config.timeout) {
            // this.timeout(config.timeout);
          }
          const data = JSON.parse(JSON.stringify(opData.requiredParams));
          data[p] = opData.notRequiredParams[p];
          if (config.IsPromiseMethod) {
            return expect(serviceMethod(data)).resolves.toBeDefined();
          }

          expect(errTestDelegate(data)).not.toThrow();
          return null;
        });
      });

      // Test for only required params
      it('should run successfully for required params', () => {
        if (config.timeout) {
          // this.timeout(config.timeout);
        }
        const data = opData.requiredParams;
        if (config.IsPromiseMethod) {
          return expect(serviceMethod(data)).resolves.toBeDefined();
        }

        expect(errTestDelegate(data)).not.toThrow();
        return null;
      });

      if (nreqParams.length > 0) {
        // Test for all params (if there are required params)
        it('should run successfully for all params', () => {
          if (config.timeout) {
            // this.timeout(config.timeout);
          }
          const data = opData.allParams;
          if (config.IsPromiseMethod) {
            return expect(serviceMethod(data)).resolves.toBeDefined();
          }

          expect(serviceMethod(data)).not.toThrow();
          return null;
        });
      }
    }

    // Test for each non-required param
    // var data = JSON.parse( JSON.stringify(opData.allParams) );
    const specialCaseValues = [];
    specialCases.forEach((specialCase) => {
      specialCase.values.forEach((valueArgs) => {
        const value = valueArgs;
        value.param = specialCase.param;
        specialCaseValues.push(value);
      });
    });

    specialCaseValues.forEach((value) => {
      it(`special case: ${value.param} ${value.name} param ${value.value}`, () => {
        if (config.timeout) {
          // this.timeout(config.timeout);
        }

        const data = JSON.parse(JSON.stringify(opData.requiredParams));
        data[value.param] = value.value;

        if (config.IsPromiseMethod) {
          // for now special egs will work with rejection until logic
          // to decide further action is implemented. Same for throw below
          return expect(serviceMethod(data)).rejects.toThrow();
        }

        expect(errTestDelegate(data)).toThrow();
        return null;
      });
    });

    if (['both', 'extension'].indexOf(config.run_only) >= 0) {
      if (rawCallback) {
        const rData = extractParamsFromSpec(serviceSpec);
        rawCallback(it, expect, q, rData, config.timeout);
      }
    }
  });
}

module.exports = { describeThis };

/*
In your test file, say user.tes.ts .. All you need do is
var service = require('../service');
var morxcha = require('morxcha');
morxcha.describeThis(service.spec, service.newUser, {TestName:'New User Test'})
*/
/*
console.log( extractParamsFromSpec(serviceSpec) ); */
/*
morxcha.raw( function(expect, assert, q) {


})
*/
/*
will need a way for people to add what assert messages should be
How do we specify what fail conditions and all should be?
*/
