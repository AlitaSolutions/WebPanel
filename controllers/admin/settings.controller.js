const router = require('express').Router();
class SettingsController{
    constructor(){
        router.get('/', this.getSettings);
        router.post('/', this.createSetting);
        router.patch('/:id', this.updateSetting);
        router.delete('/:id', this.deleteSetting);
    }
    async getSettings(req, res){
       res.status(200).json({message: 'getSettings'});
    }
    async createSetting(req,res){
        res.send(200).json({message: 'createSetting'});
    }
    async updateSetting(req,res){
        res.send(200).json({message: 'updateSetting'});
    }
    async deleteSetting(req,res){
        res.send(200).json({message: 'deleteSetting'});
    }
}
new SettingsController();
module.exports = router;