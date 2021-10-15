require('../models/users')
const BusinessBase = require('./businessBase')
const User = require('../models/users')
const MongoClient = require('mongodb').MongoClient;
const collection = "users"

class AccountBusiness extends BusinessBase{

    constructor()
    {
        super();
    }

    //Add Account logic
    //TODO: MAKE ASYNC YOU DUMB FUCK
    AddAccount(req){
        const dataBase = this.db;
        const urlPost = this.url;

        console.log('entering - AddAccount')
        //TODO: Create logic to find last id in mongoDB
        //newAccount.id = idLookup();
        //ID might be able to be deprecated due to username being unique
        //TODO: Validate that username is unique

        return new Promise(function(resolve,reject) {

        //creates object of User
        let user = new User(
            null,
            req.body.userName,
            req.body.passwordHash,
            req.body.passwordSalt
        );

        user.id = 1;
        
        MongoClient.connect(urlPost, function(err, db) {
            if(err) throw err;
            var dbo = db.db(dataBase);
            dbo.collection(collection).insertOne(user, function(err,res){
                if(err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        })
        
        console.log('exiting - AddAccount')
        })
    }

    GetAllAccounts(){
        //Can't access this.db/url from within new promise so need to set them
        const dataBase = this.db;
        const urlGet = this.url;
        //returns promise so that I can return after promise has been resolved
        return new Promise(function(resolve,reject) {
            console.log("entering - GetAllAccounts")

            MongoClient.connect(urlGet, function(err,db){
                if(err) throw err;
                var dbo = db.db(dataBase);
                dbo.collection(collection).find({}).toArray(function(err,res){
                    if (err) throw err;
                    db.close();
                    //resolve the values found from the DB
                    resolve(res);
                })
            })
        console.log('exiting - GetAllAccounts')
        })
    }

    GetSpecificAccount(userName){
        const dataBase = this.db;
        const urlGet = this.url;

        return new Promise(function(resolve,reject){
            console.log("entering - GetSpecifiedAccount")

            MongoClient.connect(urlGet, function(err,db){
                if(err) throw err;
                var dbo = db.db(dataBase);
                dbo.collection(collection).find({}, {projeection: {userName: userName}}).toArray(function(err,res){
                    if(err) throw err;
                    db.close();
                    //resolve the values found from the DB
                    resolve(res);
                })
            })
            console.log("exiting - GetAllAccounts")
        })
    }
}

module.exports = AccountBusiness
