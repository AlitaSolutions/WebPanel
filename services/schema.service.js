const db = require("../db");
const ConflictError = require("../errors/conflict.error");
const mongo = require("mongodb");
const InternalError = require("../errors/internal.error");

class SchemaService {
    static async getSchema() {
        return await db.schemas().find({}).toArray();
    }
    static async createSchema(body){
        const {name , fields} = body;
        //check if schema exists
        let schema = await db.schemas().findOne({name});
        if(schema) {
            throw new ConflictError('Schema already exists');
        }
        schema = await db.schemas().insertOne({name, fields});
        return await db.schemas().findOne({_id: schema.insertedId});
    }
    static async updateSchema(id,body){
        const {name, fields} = body;
        const schema = await db.schemas().findOneAndUpdate({_id: new mongo.ObjectId(id)}, {$set: {name, fields}});
        if(schema){
            return await db.schemas().findOne({_id: new mongo.ObjectId(id)});
        }else{
            throw new InternalError('Unable to update schema');
        }
    }
    static async deleteSchema(id){
        const schema = await db.schemas().deleteOne({_id: new mongo.ObjectId(id)});
        if(schema.deletedCount === 0){
            throw new InternalError('Unable to delete schema');
        }
        return schema;
    }
}

module.exports = SchemaService;