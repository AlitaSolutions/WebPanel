const HttpError = require("./base.error");

class ConflictError extends HttpError {
    constructor (message) {
        super(message, 409)
    }
}

module.exports = ConflictError