require('dotenv').config(); 
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATABASE_CONNECTION;
const client = new MongoClient(uri);


let instance = null;

async function getConnection(){
    if(instance == null){
        try{
            instance = await client.connect();
        } catch(err){
            console.log(err.message);
        }
    }
    return instance;
}

module.exports = {getConnection};