const router = require('express').Router();
class SchemaController{
    constructor(){
        router.get('/', this.getSchemas);
        router.post('/', this.createSchema);
        router.patch('/:id', this.updateSchema);
        router.delete('/:id', this.deleteSchema);
    }
    async getSchemas(req, res){
       res.status(200).json({message: 'getSchemas'});
    }
    async createSchema(req,res){
        res.send(200).json({message: 'createSchema'});
    }
    async updateSchema(req,res){
        res.send(200).json({message: 'updateSchema'});
    }
    async deleteSchema(req,res){
        res.send(200).json({message: 'deleteSchema'});
    }
}
new SchemaController();
module.exports = router;