const models = require('mlar')('models');
const morx = require('morx');
const q = require('q');
const runValidations = require('./validations').signup;
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

var spec = morx.spec({})
    .build('code', 'required:true')
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
        

        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Calendar API.
            authorize(JSON.parse(content), listEvents);
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
          

          
          
          function listEvents(auth) {
            const calendar = google.calendar({version: 'v3', auth});
            calendar.events.list({
              calendarId: 'primary',
              timeMin: (new Date()).toISOString(),
              maxResults: 10,
              singleEvents: true,
              orderBy: 'startTime',
            }, (err, res) => {
              if (err) return console.log('The API returned an error: ' + err);
              const events = res.data.items;
              if (events.length) {
                console.log('Upcoming 10 events:');
                events.map((event, i) => {
                  const start = event.start.dateTime || event.start.date;
                  console.log(`${start} - ${event.summary}`);
                });
              } else {
                console.log('No upcoming events found.');
              }
            });
          
          }
        
            


    }).then(content =>{
        

        /*
        fs.readFile('credentials.json', async (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Calendar API.
            let {client_secret, client_id, redirect_uris}  = JSON.parse(content).web;

            
            const oAuth2Client =  new google.auth.OAuth2( client_id, client_secret, redirect_uris[0]);
            
            await oAuth2Client.getToken(params.code, async (err, token)=> {
                console.log("GETTING TOKEN")
                console.log(err)
                 oAuth2Client.setCredentials(token)
            })
            
            // post event 
            const calendar = google.calendar({version: 'v3', oAuth2Client});
            console.log("GETTING CALENDAR")
            calendar.events.list({
                calendarId: 'primary',
                timeMin: (new Date()).toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime',
              }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const events = res.data.items;
                if (events.length) {
                  console.log('Upcoming 10 events:');
                  events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date;
                    console.log(`${start} - ${event.summary}`);
                  });
                } else {
                  console.log('No upcoming events found.');
                }
              });
            });*/
    })
    .catch(err=> {
        d.reject(err);
    })

    return d.promise;

}
service.morxspc = spec;
module.exports = service;
/*
service({
    code: '4/zQHL0uuYwFfed1mjvfguhWvXs8MFdbXP4PlmcBerJkCEIMQ2hnJpOA9JDZAL-7OTv3HDJpf0U827Wg01cWe72cU'
})*/