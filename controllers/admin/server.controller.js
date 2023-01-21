const router = require('express').Router();
const db = require('../../db');
const mongo = require("mongodb");
const {body, validationResult, param} = require("express-validator");
const ServerService = require('../../services/server.service');
class ServerController {
    constructor() {
        router.post('/clean',this.cleanupServers);
        router.get('/:serviceId',param('serviceId').isMongoId(), this.getServers);
        router.post('/:serviceId',param('serviceId').isMongoId(), this.createServer);
        router.patch('/:serviceId/:serverId',param('serviceId').isMongoId(),param('serverId').isMongoId(), this.updateServer);
        router.delete('/:serverId',param('serverId').isMongoId(), this.deleteServer);
    }
    async cleanupServers(req, res) {
        for (const server of await db.servers().find().toArray()) {
            let serverWithSchema = await ServerService.getServer(server._id);
            db.servers().updateOne({_id: new mongo.ObjectId(server._id)}, {$set: serverWithSchema});
        }
        res.status(200).json({message: 'Servers cleaned up successfully'});
    }
    async getServers(req, res) {
        const serviceId = req.params.serviceId;
        const servers = await db.servers().find({service: new mongo.ObjectId(serviceId)}).toArray();
        let serversWithSchema = [];
        for (const server of servers) {
            const serverWithSchema = await ServerService.getServer(server._id);
            serversWithSchema.push(serverWithSchema);
        }
        res.status(200).json(serversWithSchema);
    }

    // POST /api/admin/servers/:serviceId
    // {
    //     "name": "test",
    //     "visibleName": "test",
    //     "description": "test",
    //     "order": 1,
    //     "enabled": true
    // }
    async createServer(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const serviceId = req.params.serviceId;
        const service = await db.services().findOne({_id : new mongo.ObjectId(serviceId)});
        const schemaId = service.schema;
        const schema = await db.schemas().findOne({_id : new mongo.ObjectId(schemaId)});
        if (Object.keys(req.body).length == 0) {
            return res.status(400).json({message: 'No data provided'});
        }
        let server = {} ;
        let errBag = [];
        schema.fields.forEach(field => {
            if (req.body[field.name]) {
                server[field.name] = req.body[field.name];
            }else if (field.required){
                errBag.push('Required field not provided : ' + field.name);
                return;
            } else if (field.default) {
                server[field.name] = field.default;
            }

            if (field.type === 'number') {
                server[field.name] = parseInt(server[field.name]);
            }else if (field.type === 'boolean' || field.type === 'bool') {
                server[field.name] = server[field.name] === 'true';
            }else if (field.type === 'string'){
                server[field.name] = server[field.name].toString();
            }
        });
        if (errBag.length > 0) {
            return res.status(400).json({errors: errBag});
        }
        const inserted = await db.servers().insertOne({
            service: new mongo.ObjectId(serviceId),
            ...server
        });
        res.status(200).json({
            message: 'Server created successfully',
            data: await db.servers().findOne({_id: inserted.insertedId})
        });
    }

    async updateServer(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const serverId = req.params.serverId;
        const serviceId = req.params.serviceId;
        const service = await db.services().findOne({_id : new mongo.ObjectId(serviceId)});
        const schemaId = service.schema;
        const schema = await db.schemas().findOne({_id : new mongo.ObjectId(schemaId)});
        if (Object.keys(req.body).length == 0) {
            return res.status(400).json({message: 'No data provided'});
        }
        let server = {} ;
        let errBag = [];
        schema.fields.forEach(field => {
            if (req.body[field.name]) {
                server[field.name] = req.body[field.name];
            }else if (field.required){
                errBag.push('Required field not provided : ' + field.name);
                return;
            } else if (field.default) {
                server[field.name] = field.default;
            }

            if (field.type === 'number') {
                server[field.name] = parseInt(server[field.name]);
            }else if (field.type === 'boolean' || field.type === 'bool') {
                server[field.name] = server[field.name] === 'true';
            }else if (field.type === 'string'){
                server[field.name] = server[field.name].toString();
            }
        });
        if (errBag.length > 0) {
            return res.status(400).json({errors: errBag});
        }
        const updated = await db.servers().updateOne({_id: new mongo.ObjectId(serverId)}, {$set: server});
        if (updated.modifiedCount === 0) {
            return res.status(500).json({message: 'Unable to update server'});
        }
        res.status(200).json({
            message: 'Server updated successfully',
            data: await db.servers().findOne({_id: new mongo.ObjectId(serverId)})
        });
    }

    async deleteServer(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        const serverId = req.params.serverId;
        const deleted = await db.servers().deleteOne({_id: new mongo.ObjectId(serverId)});
        if (deleted.deletedCount === 0) {
            return res.status(404).json({message: 'Server not found'});
        }
        res.status(200).json({message: 'Server deleted successfully'});
    }
}

new ServerController();

module.exports = router;