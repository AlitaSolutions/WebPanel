const HttpError = require("./base.error");

class InternalError extends HttpError{
    constructor(message){
        super(message, 500)
    }
}

module.exports = InternalError