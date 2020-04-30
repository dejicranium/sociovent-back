
var cloudinary = require('cloudinary');
const q = require('q');
const morx = require('morx');

cloudinary.config({ 
    cloud_name: 'ddqye1sbf', 
    api_key: '964658396295345', 
    api_secret: 'x4bWOR1xW92YHzAzgXOjUjeemhY' 
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

service({
    country_origin: "NG",
    description: "ewrwr",
    host_social_handle: "werewrwr",
    host_social_handle_link: "",
    name: "Deji Atoyebi",
    photo: "",
    start_time: "2020-04-22 12:00 AM",
    tags: "something,light,good",
    venue: "Twitter"
})