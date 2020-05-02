const send_message_to_queue = require('./send_sqs_message')
const config = require('../../config')

module.exports = async (reminder) => {

    
    let messageData = {
        MessageBody: JSON.stringify(reminder),
        //MessageGroupId: "CollectionsDue",
        QueueUrl: config.sqs_url,
    }
    return await send_message_to_queue(messageData);

}
