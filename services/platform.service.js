const db = require("../db");
const mongo = require("mongodb");
const ConflictError = require("../errors/conflict.error");
const NotFoundError = require("../errors/notfound.error");
const InternalError = require("../errors/internal.error");
const {EventEmitter, Events} = require("../events/emitter");

class PlatformService {
    static async getPlatforms(){
        return await db.platforms().find({}).toArray();
    }

    static async createPlatform(name){
        let platform = await db.platforms().findOne({name : name});
        if(platform){
            throw new ConflictError('Platform already exists');
        }else{
            platform = await db.platforms().insertOne({name});
            platform = await db.platforms().findOne({_id: platform.insertedId});
            EventEmitter.emit(Events.PLATFORM_MODIFIED, {action: 'create', platform: platform})
            return platform;
        }
    }
    static async updatePlatform(id, name){
        let platform = await db.platforms().findOne({name : name});
        if(platform) {
            throw new ConflictError('Platform already exists');
        }else {
            let updated = await db.platforms().findOneAndUpdate({_id: new mongo.ObjectId(id)}, {$set: {name}});
            if (updated) {
                updated = await db.platforms().findOne({_id: new mongo.ObjectId(id)});
                EventEmitter.emit(Events.PLATFORM_MODIFIED, {action: 'update', platform: updated})
                return updated;
            }else{
                throw new InternalError('Platform not updated');
            }
        }
    }
    static async deletePlatform(id){
        let platform = await db.platforms().findOne({_id: new mongo.ObjectId(id)});
        if(platform){
            await db.platforms().deleteOne({_id: new mongo.ObjectId(id)});
            EventEmitter.emit(Events.PLATFORM_MODIFIED, {action: 'delete', platform: platform})
            return platform;
        }else{
            throw new NotFoundError('Platform not found');
        }
    }
}

module.exports = PlatformService;