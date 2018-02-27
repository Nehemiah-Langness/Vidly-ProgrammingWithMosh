
const EventEmitter = require('events');

var url = 'http://mylogger.io/log'

class Logger extends EventEmitter {

    log(message) {
        // Send an HTTP request
        console.log(message);

        // Raise an event
        this.emit('messageLogged', { message: message });
    }
}

module.exports = Logger;