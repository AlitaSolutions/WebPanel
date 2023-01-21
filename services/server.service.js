const db = require("../db");
const mongo = require("mongodb");
const NotFoundError = require("../errors/notfound.error");
const BadRequestError = require("../errors/badrequest.error");
const InternalError = require("../errors/internal.error");

class ServerService {
    static async getServer(serverId){
        let serverWithSchema = {};
        let server = await db.servers().findOne({_id: new mongo.ObjectId(serverId)});
        let service = await db.services().findOne({_id: new mongo.ObjectId(server.service)});
        let schema = await db.schemas().findOne({_id: new mongo.ObjectId(service.schema)});
        schema.fields.forEach(field => {
            if(server[field.name]) {
                serverWithSchema[field.name] = server[field.name];
            }else if (field.default){
                serverWithSchema[field.name] = field.default;
            }else if (field.required){
                serverWithSchema[field.name] = null;
            }

            if (field.type === 'number') {
                serverWithSchema[field.name] = parseInt(serverWithSchema[field.name]);
            }else if (field.type === 'boolean' || field.type === 'bool') {
                serverWithSchema[field.name] = serverWithSchema[field.name] === 'true';
            }else if (field.type === 'string'){
                serverWithSchema[field.name] = serverWithSchema[field.name].toString();
            }
        });
        return serverWithSchema;
    }
    static async createServer(serviceId, body){
        const service = await db.services().findOne({_id : new mongo.ObjectId(serviceId)});
        const schemaId = service.schema;
        const schema = await db.schemas().findOne({_id : new mongo.ObjectId(schemaId)});
        if (Object.keys(body).length === 0) {
            throw new BadRequestError(['No data provided']);
        }
        let server = {} ;
        let errBag = [];
        schema.fields.forEach(field => {
            if (body[field.name]) {
                server[field.name] = body[field.name];
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
            throw new BadRequestError(errBag);
        }
        const inserted = await db.servers().insertOne({
            service: new mongo.ObjectId(serviceId),
            ...server
        });
        return (await db.servers().findOne({_id: inserted.insertedId}));
    }
    static async cleanupServers(){
        for (const server of await db.servers().find().toArray()) {
            let serverWithSchema = await ServerService.getServer(server._id);
            db.servers().updateOne({_id: new mongo.ObjectId(server._id)}, {$set: serverWithSchema});
        }
    }
    static async getServerList(serviceId){
        const servers = await db.servers().find({service: new mongo.ObjectId(serviceId)}).toArray();
        let serversWithSchema = [];
        for (const server of servers) {
            const serverWithSchema = await ServerService.getServer(server._id);
            serversWithSchema.push(serverWithSchema);
        }
    }
    static async deleteServer(serverId){
        const server = await db.servers().findOne({_id: new mongo.ObjectId(serverId)});
        if (server) {
            await db.servers().deleteOne({_id: new mongo.ObjectId(serverId)});
            return server;
        }else{
            throw new NotFoundError('Server not found');
        }
    }
    static async updateServer(serviceId, serverId, body){
        const service = await db.services().findOne({_id : new mongo.ObjectId(serviceId)});
        const schemaId = service.schema;
        const schema = await db.schemas().findOne({_id : new mongo.ObjectId(schemaId)});
        if (Object.keys(body).length == 0) {
            throw new BadRequestError(["No data provided"]);
        }
        let server = {} ;
        let errBag = [];
        schema.fields.forEach(field => {
            if (body[field.name]) {
                server[field.name] = body[field.name];
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
            throw new BadRequestError(errBag);
        }
        const updated = await db.servers().updateOne({_id: new mongo.ObjectId(serverId)}, {$set: server});
        if (updated.value){
            return (await db.servers().findOne({_id: new mongo.ObjectId(serverId)}));
        }else{
            throw new InternalError('Server not found');
        }
    }
}

module.exports = ServerService;