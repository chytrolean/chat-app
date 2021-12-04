const moment = require('moment')

function formatMessage(username,text,smile){
    return{
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage