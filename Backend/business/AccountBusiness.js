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

    GetSpecificAccount(userName){
        let dataBase = this.db
        let url = this.url

        return new Promise(function(resolve,reject){
            console.log("entering - GetSpecifiedAccount")

            MongoClient.connect(url, function(err,db){
                if(err) throw err;
                var dbo = db.db(dataBase);
                var query = {userName: userName}
                dbo.collection(collection).find(query).toArray(function(err,res){
                    if(err) throw err;
                    db.close();
                    if(res[0] == undefined){
                        resolve({status: "ERROR", Error: "No user found with that name"})
                    }
                    //resolve the values found from the DB
                    resolve(res);
                })
            })
            console.log("exiting - GetSpecifiedAccount")
        })
    }

    //Add Account logic
    async AddAccount(req){
        let dataBase = this.db
        let url = this.url

        console.log('entering - AddAccount')
        
        let account = await this.GetSpecificAccount(req.body.userName)
        console.log(account)
        if(account.status){
            console.log("in da register")
            //creates object of User
            let user = new User(
                req.body.userName,
                req.body.passwordHash,
                req.body.passwordSalt
            );
            
            MongoClient.connect(url, function(err, db) {
                if(err) throw err;
                var dbo = db.db(dataBase);
                dbo.collection(collection).insertOne(user, function(err,res){
                    if(err) throw err;
                    console.log("1 document inserted");
                    db.close();
                });
            })

            console.log('exiting - AddAccount')
            return ({status:"OK", message:"successfully inserted user"})
        }
        else{
            return ({status:"ERROR", message:"UserName already taken"});
        }


        /*this.GetSpecificAccount(req.body.userName).then(function(v){
            new Promise(function(resolve,reject){
                if(v.status){
                    console.log(v)
                    console.log("in da register")
                    //creates object of User
                    let user = new User(
                        req.body.userName,
                        req.body.passwordHash,
                        req.body.passwordSalt
                    );
                    
                    MongoClient.connect(url, function(err, db) {
                        if(err) throw err;
                        var dbo = db.db(dataBase);
                        dbo.collection(collection).insertOne(user, function(err,res){
                            if(err) throw err;
                            console.log("1 document inserted");
                            db.close();
                        });
                    })

                    console.log('exiting - AddAccount')
                    return ({status:"OK", message:"successfully inserted user"})
                }
                else {
                    console.log(v)
                    return ({status:"ERROR", message:"UserName already taken"});
                }
            })
        })

        /*this.GetSpecificAccount(req.body.userName).catch(function(v){
            return new Promise(function(resolve,reject){
                if(v.status){
                    console.log(v)
                    //creates object of User
                    let user = new User(
                        req.body.userName,
                        req.body.passwordHash,
                        req.body.passwordSalt
                    );
                    
                    MongoClient.connect(url, function(err, db) {
                        if(err) throw err;
                        var dbo = db.db(dataBase);
                        dbo.collection(collection).insertOne(user, function(err,res){
                            if(err) throw err;
                            console.log("1 document inserted");
                            db.close();
                        });
                    })

                    console.log('exiting - AddAccount')
                    resolve({status:"OK", message:"successfully inserted user"})
                }
                else {
                    console.log(v)
                    reject({status:"ERROR", message:"UserName already taken"});
                }
            })
        })


        return new Promise(function(resolve,reject){
            getSpec(req.body.userName).then(function(v){
                if(v[0].userName){
                    reject({status:"ERROR",message:"duplicate userName"})
                }
                else{
                    //creates object of User
                    let user = new User(
                        req.body.userName,
                        req.body.passwordHash,
                        req.body.passwordSalt
                    );
                    
                    MongoClient.connect(url, function(err, db) {
                        if(err) throw err;
                        var dbo = db.db(dataBase);
                        dbo.collection(collection).insertOne(user, function(err,res){
                            if(err) throw err;
                            console.log("1 document inserted");
                            db.close();
                        });
                    })

                    console.log('exiting - AddAccount')
                    resolve({status:"OK",messate:"successfully inserted user"})
                }
            })
        })*/
    }

    GetAllAccounts(){
        //Can't access this.db/url from within new promise so need to set them
        //returns promise so that I can return after promise has been resolved
        let url = this.url
        let dataBase = this.db

        return new Promise(function(resolve,reject) {
            console.log("entering - GetAllAccounts")

            MongoClient.connect(url, function(err,db){
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
}

module.exports = AccountBusiness
