const {body, validationResult} = require("express-validator");
const router = require('express').Router();
const db = require('../../db');
const mongo = require('mongodb');
class PlatformController{
    constructor(){
        router.get('/', this.getPlatforms);
        router.post('/', body('name').notEmpty().isString(), this.createPlatform);
        router.patch('/:id', body('name').notEmpty().isString(), this.updatePlatform);
        router.delete('/:id', this.deletePlatform);
    }
    async getPlatforms(req, res){
        res.status(200).json(await db.platforms().find({}).toArray());
    }
    async createPlatform(req,res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {name} = req.body;
        //check if platform exists
        let platform = await db.platforms().findOne({name});
        if(platform){
            return res.status(409).json({message: 'Platform already exists'});
        }else{
            platform = await db.platforms().insertOne({name});
            res.status(200).json({
                message: 'Platform created',
                data: await db.platforms().findOne({_id: platform.insertedId}),
            });
        }
    }
    async updatePlatform(req,res){
        const {id} = req.params;
        const {name} = req.body;
        const platform = await db.platforms().findOneAndUpdate({_id: new mongo.ObjectId(id)}, {$set: {name}});
        if(platform.value){
            res.status(200).json({message: 'Platform updated' , data : await db.platforms().findOne({_id: new mongo.ObjectId(id)})});
        }else{
            res.status(404).json({message: 'Platform not found'});
        }
    }
    async deletePlatform(req,res){
        const {id} = req.params;
        const platform = await db.platforms().deleteOne({_id: new mongo.ObjectId(id)});
        if(platform.deletedCount === 1){
            res.status(200).json({message: 'Platform deleted'});
        }else{
            res.status(404).json({message: 'Platform not found'});
        }
    }
}
new PlatformController();
module.exports = router;