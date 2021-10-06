require('../models/users')
const BusinessBase = require('./businessBase')
const MongoClient = require('mongodb').MongoClient;
const collection = "users"

class AccountBusiness extends BusinessBase{

    constructor()
    {
        super();
    }

    //Add Account logic
    AddAccount(newAccount){
        const dataBase = this.db;
        console.log('entering - AddAccount')
        //TODO: Create logic to find last id in mongoDB
        //newAccount.id = idLookup();
        
        newAccount.id = 1;
        
        MongoClient.connect(this.url, function(err, db) {
            if(err) throw err;
            var dbo = db.db(dataBase);
            dbo.collection(collection).insertOne(newAccount, function(err,res){
                if(err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        })
        
        
        console.log(newAccount.userName)
        console.log('exiting - AddAccount')
    }

}

module.exports = AccountBusiness
