const HttpError = require("./base.error");

class ForbiddenError extends HttpError {
    constructor (message) {
        super(message, 403)
    }
}

module.exports = ForbiddenError;