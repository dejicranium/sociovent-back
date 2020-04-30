class AppError extends Error {
  constructor(config = { code: '01', name: 'AppError' }, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    this.name = config.name || 'CustomError';
    // Custom debugging information
    this.code = config.code || '01'; // Decide on custom error later
    this.errorTimestamp = Date.now();
  }
}

const ErrorUtils = {};
ErrorUtils.throwError = function throwError(message, config) {
  const em = message || 'Some error occured';
  throw new AppError(config, em);
};

ErrorUtils.isAppError = function isAppError(errorObject) {
  return errorObject instanceof AppError;
};

ErrorUtils.handleError = function handleError(optionalDefferedObject, errorObject) {
  // Do some logging and all here on the error object
  const eo = errorObject;
  let em = errorObject.message;
  if (!ErrorUtils.isAppError(errorObject)) {
    em = 'Service error.'; // This is so we don't inadvertently return params.x is undefined like errors to the user
    eo.message = em;
    eo.code = '01';
  }
  if (optionalDefferedObject && optionalDefferedObject.reject) {
    optionalDefferedObject.reject(eo);
  }
};

ErrorUtils.ErrorClass = AppError;

module.exports = ErrorUtils;

// const q = require('q');
// function a(n) {
//   const d = q.defer();
//   const b = {};
//   q.fcall( () => {
//     if(n % 2 !== 0) {
//       ErrorUtils.throwError("N should be divisible by 2", {});
//     } else {
//       b.m.j = 2;
//       d.resolve(1)
//     }
//   })
//   .catch(e => {
//     ErrorUtils.handleError(d, e);
//   })

//   return d.promise;
// }
// a(2).then(x=>{
//   console.log(x)
// }).catch(e => {
//   console.dir(e);
//   console.log(e.code, e.message);
// })
