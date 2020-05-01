
var cloudinary = require('cloudinary');
const q = require('q');
const morx = require('morx');

cloudinary.config({ 
    cloud_name: 'dtik2xyhf', 
    api_key: '584873184599193', 
    api_secret: 'ODJU0IiMlj8Z6O4a4KzeMTASGxA' 
  });
var spec = morx.spec({})
    .build('photo', 'required:true')
    .end();

function service(data) {

    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        const params = validParameters.params;
        return cloudinary.uploader.upload(params.photo)
    })
    .then(result=> {
        if (!result) throw new Error("Could not upload photo");
        d.resolve(result.url)
    })
    .catch(err=> {
        console.log(err.stack)
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;
