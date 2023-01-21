const router = require('express').Router();
const {validationResult, param} = require("express-validator");
const ServerService = require('../../services/server.service');
const ErrorHandler = require("../../errors/error.handler");
const BadRequestError = require("../../errors/badrequest.error");
const NotFoundError = require("../../errors/notfound.error");
class ServerController {
    constructor() {
        router.post('/clean',this.cleanupServers);
        router.get('/:serviceId',param('serviceId').isMongoId().notEmpty(), this.getServers);
        router.post('/:serviceId',param('serviceId').isMongoId().notEmpty(), this.createServer);
        router.patch('/:serviceId/:serverId',param('serviceId').isMongoId().notEmpty(),param('serverId').isMongoId().notEmpty(), this.updateServer);
        router.delete('/:serverId',param('serverId').isMongoId().notEmpty(), this.deleteServer);
    }
    async cleanupServers(req, res) {
        await ServerService.cleanupServers();
        res.status(200).json({message: 'Servers cleaned up successfully'});
    }
    async getServers(req, res) {
        const serviceId = req.params.serviceId;
        const serversWithSchema = await ServerService.getServerList(serviceId);
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
            return ErrorHandler.handle(res, new BadRequestError(errors.array()));
        }
        const serviceId = req.params.serviceId;
        try {
            const server = await ServerService.createServer(serviceId, req.body);
            return res.status(200).json({
                message: 'Server created successfully',
                data: server
            });
        }catch (e){
            return ErrorHandler.handle(e);
        }
    }
    async updateServer(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           return ErrorHandler.handle(res, new BadRequestError(errors.array()));
        }
        const serverId = req.params.serverId;
        const serviceId = req.params.serviceId;
        try {
            const updated = await ServerService.updateServer(serverId, serviceId, req.body);
            return res.status(200).json({
                message: 'Server updated successfully',
                data: updated
            });
        }catch (e){
            return ErrorHandler.handle(res, e);
        }
    }
    async deleteServer(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ErrorHandler.handle(res, new BadRequestError(errors.array()));
        }
        const serverId = req.params.serverId;
        const deleted = ServerService.deleteServer(serverId);
        if (deleted.deletedCount === 0) {
            return ErrorHandler.handle(res, new NotFoundError('Server not found'));
        }
        res.status(200).json({message: 'Server deleted successfully'});
    }
}

new ServerController();

module.exports = router;