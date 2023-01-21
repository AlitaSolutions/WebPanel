const db = require("../db");
const NotFoundError = require("../errors/notfound.error");
const InternalError = require("../errors/internal.error");
const mongo = require("mongodb");
class SettingService {
    static async getSettings(){
        const settings = await db.settings().find({}).toArray();
        return settings;
    }
    static async createSetting(key, value){
        let settings = await db.settings().findOne({key});
        if(settings){
            throw new NotFoundError('Setting already exists');
        }
        settings = await db.settings().insertOne({key,value});
        return await db.settings().findOne({_id: settings.insertedId});
    }
    static async updateSetting(key, value){
        const settings = await db.settings().findOneAndUpdate({key}, {$set: {value}});
        if (settings) {
            return db.settings().findOne({key});
        }else{
            throw new InternalError('unable to update setting');
        }
    }
    static async deleteSetting(id){
        const setting = await db.settings().deleteOne({_id: new mongo.ObjectId(id)});
        if(setting.deletedCount === 0){
            throw new NotFoundError('Setting not found');
        }
        return setting;
    }
}

module.exports = SettingService;