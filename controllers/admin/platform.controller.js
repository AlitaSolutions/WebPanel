const router = require('express').Router();
class PlatformController{
    constructor(){
        router.get('/', this.getPlatforms);
        router.post('/', this.createPlatform);
        router.patch('/:id', this.updatePlatform);
        router.delete('/:id', this.deletePlatform);
    }
    async getPlatforms(req, res){
       res.status(200).json({message: 'getPlatforms'});
    }
    async createPlatform(req,res){
        res.send(200).json({message: 'createPlatform'});
    }
    async updatePlatform(req,res){
        res.send(200).json({message: 'updatePlatform'});
    }
    async deletePlatform(req,res){
        res.send(200).json({message: 'deletePlatform'});
    }
}
new PlatformController();
module.exports = router;