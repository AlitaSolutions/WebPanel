const router = require('express').Router();
const db = require('../../db');
const mongo = require("mongodb");
const {body, validationResult} = require("express-validator");

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
            body('name').notEmpty().isString(),
            body('visibleName').notEmpty().isString(),
            body('description').isString(),
            body('order').isNumeric(),
            body('enabled').isBoolean(),
            body('schemaId').isMongoId().notEmpty(),
            this.updateService);
        router.delete('/:id', this.deleteService);
    }

    async getServices(req, res) {
        const services = await db.services().find({}).toArray();
        for (let service of services) {
            service.schema = await db.schemas().findOne({_id: service.schema});
        }
        res.status(200).json(services);
    }

    async createService(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {name, visibleName , description,order,enabled,schemaId} = req.body;
        //check if service exists
        let service = await db.services().findOne({name : name});
        if (service) {
            return res.status(409).json({message: 'Service already exists'});
        }
        service = await db.services().insertOne({
            name : name,
            visibleName : visibleName,
            description : description,
            order : order,
            enabled : enabled,
            schema : new mongo.ObjectId(schemaId)
        });
        res.status(200).json({
            message: 'Service created successfully',
            data: service
        });
    }

    async updateService(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const {id} = req.params;
        const {name, visibleName , description,order,enabled,schemaId} = req.body;
        let service = await db.services().findOne({_id : new mongo.ObjectId(id)});
        if (!service){
            return res.status(404).json({message: 'Service not found'});
        }
        if (service.name !== name){
            let isExists = await db.services().findOne({name : name});
            if (isExists){
                return res.status(409).json({message: 'duplicate service name'});
            }
        }
        service = await db.services().findOneAndUpdate({_id: new mongo.ObjectId(id)}, {
            $set: {
                name : name,
                visibleName : visibleName,
                description : description,
                order : order,
                enabled : enabled,
                schema : new mongo.ObjectId(schemaId)
            }
        });
        if (service.value) {
            res.status(200).json({message: 'Service updated'});
        } else {
            res.status(404).json({message: 'Service not found'});
        }
    }

    async deleteService(req, res) {
        const {id} = req.params;
        const service = await db.services().findOneAndDelete({_id: new mongo.ObjectId(id)});
        if (service.value) {
            res.status(200).json({message: 'Service deleted'});
        } else {
            res.status(404).json({message: 'Service not found'});
        }
    }
}

new ServiceController();
module.exports = router;