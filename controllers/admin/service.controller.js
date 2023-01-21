const router = require('express').Router();
const db = require('../../db');
const mongo = require("mongodb");
const {body, validationResult, param} = require("express-validator");
const ServiceService = require("../../services/service.service");
const ErrorHandler = require("../../errors/error.handler");
const BadRequestError = require("../../errors/badrequest.error");

class ServiceController {
    constructor() {
        router.get('/', this.getServices);
        router.post('/',
            body('name').notEmpty().isString(),
            body('visibleName').notEmpty().isString(),
            body('description').isString(),
            body('order').isNumeric(),
            body('enabled').isBoolean(),
            body('schemaId').isMongoId().notEmpty(),
            this.createService);
        router.patch('/:id',
            param('id').isMongoId().notEmpty(),
            body('name').notEmpty().isString(),
            body('visibleName').notEmpty().isString(),
            body('description').isString(),
            body('order').isNumeric(),
            body('enabled').isBoolean(),
            body('schemaId').isMongoId().notEmpty(),
            this.updateService);
        router.delete('/:id', param('id').isMongoId().notEmpty() ,this.deleteService);
    }

    async getServices(req, res) {
        res.status(200).json(ServiceService.getServices());
    }

    async createService(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           return ErrorHandler.handle(res, new BadRequestError(errors.array()));
        }
        try {
            return res.status(200).json({
                message: 'Service created successfully',
                data: await ServiceService.createService(req.body)
            });
        } catch (e) {
            return ErrorHandler.handle(res, e);
        }
    }

    async updateService(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ErrorHandler.handle(res, new BadRequestError(errors.array()));
        }
        const {id} = req.params;
        try {
            const service = ServiceService.updateService(id, req.body);
            res.status(200).json({message: 'Service updated', data: service});
        } catch (e) {
            return ErrorHandler.handle(res, e);
        }
    }

    async deleteService(req, res) {
        const {id} = req.params;
        try {
            const service = ServiceService.deleteService(id);
            res.status(200).json({message: 'Service deleted'});
        }catch (e){
            return ErrorHandler.handle(res, e);
        }
    }
}

new ServiceController();
module.exports = router;