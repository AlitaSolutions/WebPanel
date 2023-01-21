const HttpError = require("./base.error");

class NotFoundError extends HttpError {
    constructor (message) {
        super(message, 404)
    }
}

module.exports = NotFoundError