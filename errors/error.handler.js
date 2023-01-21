const HttpError = require("./base.error");
const BadRequestError = require("./badrequest.error");
module.exports = {
    handle: function (res,e){
        if (e instanceof HttpError) {
            if (e instanceof BadRequestError) {
                res.status(e.status).json({
                    errors: e.getErrorBag()
                })
            }else{
                res.status(e.status).json({
                    error: e.message
                })
            }
        }else{
            res.status(500).json({
                error: e.message
            })
        }
    }
}

