const models = require('mlar')('models');
const moment = require('moment')
const sendtoSqs  = require('./services/queue/send_reminder');
const { Op } = require('sequelize');

const date = moment().toISOString().split('T').join(' ').split('Z').join('').split(' ')[0];
const hour = moment().hour();

const gteDateString = `${date} ${hour}:00:00`;
const lteDateString  = `${date} ${hour}:59:59`;

const likestmt = {
    [Op.like] : [gteDateString, lteDateString]
}

async function getEvents() {
   // const query = `SELECT * from reminders WHERE first_reminder_time BETWEEN "${gteDateString}" AND "${lteDateString}"`
   //// let events = await models.sequelize.query(query)
    //return events[0];

    return models.reminder.findAll({
        where: {
            
        }
    })

}







var CronJob = require('cron').CronJob;
console.log('starting cron job')
var job = new CronJob('00 02 * * * *', async function() {
    console.log('Getting events');
    let events = await getEvents();

    if (events) {

        events.forEach(async ev => {
           let r = await sendtoSqs(ev)
           console.log(r)
        });
    }


  
  

}, null, true, 'America/Los_Angeles');


module.exports = job