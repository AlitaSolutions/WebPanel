const router = require('express').Router();
const db = require('../../db');
class SettingsController{
    constructor(){
        router.get('/', this.getSettings);
        router.post('/', this.createSetting);
        router.patch('/:key', this.updateSetting);
        router.delete('/:key', this.deleteSetting);
    }

    async getSettings(req, res){
      const settings =  await db.settings().find({}).toArray();
        res.status(200).json(settings);
    }
    async createSetting(req,res){
        const {key,value} = req.body;
        //check if setting exists
        let setting = await db.settings().findOne({key});
        if(setting){
            return res.status(409).json({message: 'Setting already exists'});
        }
        setting = await db.settings().insertOne({key,value});
        res.status(200).json({
            message: 'Setting created',
            setting: await db.settings().findOne({_id: setting.insertedId}),
        });
    }
    async updateSetting(req,res){
        const {key} = req.params;
        const {value} = req.body;
        const setting = await db.settings().findOneAndUpdate({key}, {$set: {value}});
        if(setting.value){
            res.status(200).json({message: 'Setting updated'});
        }else{
            res.status(404).json({message: 'Setting not found'});
        }
    }
    async deleteSetting(req,res){
        const {key} = req.params;
        const setting = await db.settings().deleteOne({key});
        if(setting.deletedCount === 1){
            res.status(200).json({message: 'Setting deleted'});
        }else{
            res.status(404).json({message: 'Setting not found'});
        }
    }
}
new SettingsController();
module.exports = router;