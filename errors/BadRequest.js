class BadRequest extends Error {
    constructor(message) {
        super(message);
        this.name = '(400) Bad Request';
    }
}

module.exports = BadRequest;