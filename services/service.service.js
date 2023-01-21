const db = require("../db");
const mongo = require("mongodb");
const ConflictError = require("../errors/conflict.error");
const NotFoundError = require("../errors/notfound.error");
const InternalError = require("../errors/internal.error");

class ServiceService {
    static async getServices() {
        const services = await db.services().find({}).toArray();
        for (let service of services) {
            service.schema = await db.schemas().findOne({_id: service.schema});
        }
    }
    static async createService(body){
        const {name, visibleName , description,order,enabled,schemaId} = body;
        //check if service exists
        let service = await db.services().findOne({name : name});
        if (service) {
            throw new ConflictError('Service already exists');
        }
        service = await db.services().insertOne({
            name : name,
            visibleName : visibleName,
            description : description,
            order : order,
            enabled : enabled,
            schema : new mongo.ObjectId(schemaId)
        });
        return await db.services().findOne({_id: service.insertedId});
    }
    static async updateService(id, body){
        const {name, visibleName , description,order,enabled,schemaId} = req.body;
        let service = await db.services().findOne({_id : new mongo.ObjectId(id)});
        if (!service){
            throw new NotFoundError('Service not found');
        }
        if (service.name !== name){
            let isExists = await db.services().findOne({name : name});
            if (isExists){
                throw new ConflictError('Service already exists');
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
            return await db.services().findOne({_id: new mongo.ObjectId(id)});
        } else {
           throw new InternalError('Service not updated');
        }
    }
    static async deleteService(id){
        let service = await db.services().findOne({_id: new mongo.ObjectId(id)});
        if(service){
            await db.services().deleteOne({_id: new mongo.ObjectId(id)});
            return service;
        }else{
            throw new NotFoundError('Service not found');
        }
    }
}

module.exports = ServiceService;