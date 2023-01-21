const HttpError = require("./base.error");

class BadRequestError extends HttpError {
    constructor (message) {
        super(message.concat("\n"), 400)
        this.errorBag = message
    }
    getErrorBag(){
        return this.errorBag
    }
}

module.exports = BadRequestError