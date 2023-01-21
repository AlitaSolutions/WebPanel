const {body, validationResult, param} = require("express-validator");
const router = require('express').Router();
const PlatformService = require("../../services/platform.service");
const ErrorHandler = require('../../errors/error.handler');
const BadRequestError = require("../../errors/badrequest.error");
class PlatformController{
    constructor(){
        router.get('/', this.getPlatforms);
        router.post('/', body('name').notEmpty().isString(), this.createPlatform);
        router.patch('/:id', param('id').isMongoId().notEmpty(),body('name').notEmpty().isString(), this.updatePlatform);
        router.delete('/:id', param('id').isMongoId().notEmpty(),this.deletePlatform);
    }
    async getPlatforms(req, res){
        res.status(200).json({data: PlatformService.getPlatforms()});
    }
    async createPlatform(req,res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return ErrorHandler.handle(res, new BadRequestError(errors.array()));
        }
        const {name} = req.body;
        try {
            let platform = PlatformService.createPlatform(name);
            return res.status(200).json({
                message: 'Platform created',
                data: platform,
            });
        }catch (e) {
            return ErrorHandler.handle(res,e);
        }
    }
    async updatePlatform(req,res){
        const {id} = req.params;
        const {name} = req.body;
        try {
            const platform = PlatformService.updatePlatform(id, name);
            res.status(200).json({message: 'Platform updated', data: platform});
        }catch (e) {
            return ErrorHandler.handle(res,e);
        }
    }
    async deletePlatform(req,res){
        const {id} = req.params;
        try {
            const platform = PlatformService.deletePlatform(id);
            res.status(200).json({message: 'Platform deleted'});
        }catch (e) {
           return ErrorHandler.handle(res,e);
        }
    }
}
new PlatformController();
module.exports = router;