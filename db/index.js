const mongo = require('mongodb');
let db;
async function connectMongoDB(url) {
    const client = await mongo.MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    db = client.db();
}
async function setup(){
    db.collection('platforms').createIndex({name: 1}, {unique: true});
    db.collection('schemas').createIndex({name: 1}, {unique: true});
    db.collection('settings').createIndex({key: 1}, {unique: true});
}
module.exports = {
    setup : setup,
    connection : connectMongoDB,
    database : ()=>db,
    platforms : ()=>db.collection('platforms'),
    schemas : ()=>db.collection('schemas'),
    services : ()=>db.collection('services'),
    servers : ()=>db.collection('servers'),
    settings : ()=>db.collection('settings')

}