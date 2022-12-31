const router = require('express').Router();
const db = require('../../db');
class SchemaController{
    constructor(){
        router.get('/', this.getSchemas);
        router.post('/', this.createSchema);
        router.patch('/:id', this.updateSchema);
        router.delete('/:id', this.deleteSchema);
    }
    /*
    Example Schema :
    {
        "name": "Game",
        "fields": [
            {
                "name": "title",
                "type": "string",
                "required": true,
                "default": "Untitled"
            },
            {
                "name": "description",
                "type": "string",
                "required": false,
                "default": ""
            },
            {
                "name": "author",
                "type": "string",
                "required": true,
                "default": "Anonymous"
            }
        ]
    }
     */
    async getSchemas(req, res){
        const schemas = await db.schemas().find({}).toArray();
        res.status(200).json(schemas);
    }
    async createSchema(req,res){
        const {name , fields} = req.body;
        //check if schema exists
        let schema = await db.schemas().findOne({name});
        if(schema){
            return res.status(409).json({message: 'Schema already exists'});
        }else{
            schema = await db.schemas().insertOne({name, fields});
            res.status(200).json({
                message: 'Schema created',
                schema: await db.schemas().findOne({_id: schema.insertedId}),
            });
        }
    }
    async updateSchema(req,res){
        const {id} = req.params;
        const {name, fields} = req.body;
        const schema = await db.schemas().findOneAndUpdate({_id: id}, {$set: {name, fields}});
        if(schema.value){
            res.status(200).json({message: 'Schema updated'});
        }
    }
    async deleteSchema(req,res){
        const {id} = req.params;
        const schema = await db.schemas().delete({_id: id});
        if(schema.deletedCount === 1){
            res.status(200).json({message: 'Schema deleted'});
        }else{
            res.status(404).json({message: 'Schema not found'});
        }
    }
}
new SchemaController();
module.exports = router;