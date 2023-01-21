const router = require('express').Router();
const {body, validationResult, param} = require("express-validator");
const SchemaService = require("../../services/schema.service");
const ErrorHandler = require("../../errors/error.handler");
const BadRequestError = require("../../errors/badrequest.error");
class SchemaController{
    constructor(){
        router.get('/', this.getSchemas);
        router.post('/',
            body('name').notEmpty().isString(),
            body('fields').isArray(),
            this.createSchema);
        router.patch('/:id',
            param('id').isMongoId().notEmpty(),
            body('name').notEmpty().isString(),
            body('fields').isArray(),
            this.updateSchema);
        router.delete('/:id', this.deleteSchema);
    }
    /*
    Example Schema :
    {
        "name": "Game",
        "fields": [
            {
                "name": "title",
                "type": "string",
                "required": true,
                "default": "Untitled"
            },
            {
                "name": "description",
                "type": "string",
                "required": false,
                "default": ""
            },
            {
                "name": "author",
                "type": "string",
                "required": true,
                "default": "Anonymous"
            }
        ]
    }
     */
    async getSchemas(req, res){
        res.status(200).json({data: await SchemaService.getSchema() });
    }
    async createSchema(req,res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
           return ErrorHandler.handle(res, new BadRequestError(errors.array()));
        }
        try {
            const schema = await SchemaService.createSchema(req.body);
            res.status(200).json({
                message: 'Schema created',
                data: schema,
            });
        }catch (e) {
            ErrorHandler.handle(res, e);
        }
    }
    async updateSchema(req,res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return ErrorHandler.handle(res, new BadRequestError(errors.array()));
        }
        const {id} = req.params;
        try {
            const schema = await SchemaService.updateSchema(id, req.body);
            res.status(200).json({
                message: 'Schema updated',
                data: schema,
            });
        }catch (e) {
            ErrorHandler.handle(res, e);
        }
    }
    async deleteSchema(req,res){
        const {id} = req.params;
        try{
            await SchemaService.deleteSchema(id);
            res.status(200).json({message: 'Schema deleted'});
        }catch (e){
            ErrorHandler.handle(res, e);
        }
    }
}
new SchemaController();
module.exports = router;