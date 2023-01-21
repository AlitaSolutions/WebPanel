const db = require("../db");
const mongo = require("mongodb");

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
}

module.exports = ServerService;