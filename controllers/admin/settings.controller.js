const router = require('express').Router();
const db = require('../../db');
const mongo = require("mongodb");
const {body, validationResult} = require("express-validator");
class SettingsController{
    constructor(){
        router.get('/', this.getSettings);
        router.post('/',
            body("key").notEmpty().isString(),
            body("value").notEmpty().isString(),
            this.createSetting);
        router.patch('/:key',
            body("value").notEmpty().isString(),
            this.updateSetting);
        router.delete('/:id', this.deleteSetting);
    }

    async getSettings(req, res){
      const settings =  await db.settings().find({}).toArray();
        res.status(200).json(settings);
    }
    async createSetting(req,res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {key,value} = req.body;
        //check if setting exists
        let setting = await db.settings().findOne({key});
        if(setting){
            return res.status(409).json({message: 'Setting already exists'});
        }
        setting = await db.settings().insertOne({key,value});
        res.status(200).json({
            message: 'Setting created',
            data: await db.settings().findOne({_id: setting.insertedId}),
        });
    }
    async updateSetting(req,res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
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
        const {id} = req.params;
        const setting = await db.settings().deleteOne({_id: new mongo.ObjectId(id)});
        if(setting.deletedCount === 1){
            res.status(200).json({message: 'Setting deleted'});
        }else{
            res.status(404).json({message: 'Setting not found'});
        }
    }
}
new SettingsController();
module.exports = router;