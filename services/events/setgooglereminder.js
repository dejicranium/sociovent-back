const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const moment = require('moment');
const runValidations = require('./validations').signup;
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

let event = null;

var spec = morx.spec({})
    .build('code', 'required:true')
    .build('session_id', 'required:true')
    .end();

function service(data) {
    function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
    }   
    var d = q.defer();
    q.fcall(async () => {
        var validParameters = morx.validate(data, spec, {
            throw_error: true
        });
        
        params = validParameters.params;
        
        const preremind = await models.pre_reminders.findOne({
            where: {
                session_id: params.session_id
            }
        })

        if (!preremind) throw new Error("Error creating reminder");

        event = await models.events.findOne({
            where: {
                id: preremind.event_id
            }
        });

        if (!event) throw new Error("Error getting event");

        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Calendar API.
            authorize(JSON.parse(content), createEvent);
        });
          
 
          function authorize(credentials, callback) {
          
            const {client_secret, client_id, redirect_uris} = credentials.web;
            console.log('*******')
            console.log('*******')
            console.log(redirect_uris)
            const oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);
          
             return getAccessToken(oAuth2Client, callback);
             
            ;
          }
          function getAccessToken(oAuth2Client, callback) {
            
              oAuth2Client.getToken(data.code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                /*
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                  if (err) return console.error(err);
                  console.log('Token stored to', TOKEN_PATH);
                });*/
                callback(oAuth2Client);
              });
            
          }
          

          
          
        async function createEvent(auth) {
            const calendar = google.calendar({version: 'v3', auth});
            const start_time = event.start_time;
            var e = {
              'summary': `${event.name} on ${event.venue}`,
              'location': `${event.venue}`,
              'description': `${event.description}`,
              'start': {
                'dateTime': moment(start_time).toISOString().split(' ').join(''),
                'timeZone': 'Africa/Lagos',
              },
              'end': {
                'dateTime': moment(start_time).toISOString().split(' ').join(''),
                'timeZone': 'Africa/Lagos',
              },

              'reminders': {
                'useDefault': false,
                'overrides': [
                  {'method': 'email', 'minutes': 24 * 60},
                  {'method': 'popup', 'minutes': 10},
                ],
              },
            };
            calendar.events.insert({
              auth: auth,
              calendarId: 'primary',
              resource: e
            }, (err, res) => {
              if (err) {
                  d.reject(err)
              }
              console.log(res);
              console.log('Reminder set')
              event.update({potential_attendees: event.potential_attendees + 1})
              d.resolve(event)
            }) 
          }
            


    })
    .catch(err=> {
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;

service({
    code: '4/zgF6cmYMfnMZ0DVQ5ODVCVYYCPc7U2d9i5B1sHoK_TNq9PdPyulXo-I00oqe5H9EH4akqf4_2YVFdHH1wHqXiKU',
    session_id: '434'
})