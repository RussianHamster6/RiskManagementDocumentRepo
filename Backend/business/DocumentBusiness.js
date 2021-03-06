require('../models/document')
const BusinessBase = require('./businessBase')
const Document = require('../models/document')
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs')
const collection = "documents"

class DocumentBusiness extends BusinessBase{
    
    constructor()
    {
        super();
    }

    //Adds a new document to the database and places the document in the correct place
    async AddDocument(doc,fileName,fileExtention,expiryDate){
        console.log("entering - Add Document")
        console.log(doc)
        let url = this.url
        let dataBase = this.db
        let filePath = ""

        if(fileExtention.charAt(0) == "."){
            filePath = './docStore/' + fileName + fileExtention
            fileName = fileName + fileExtention
        }
        else{
            filePath = './docStore/' + fileName + "." + fileExtention
            fileName = fileName + "." + fileExtention 
        }
        let record = new Document(fileName,filePath,expiryDate)
        let exists = await this.doesDocumentExist(fileName)
        if(exists){
            return({status:"ERROR", message:"A Document was found with that name, please update or use a different name"})
        }
        else{
            MongoClient.connect(url, function(err, db) {
                if(err) throw err;
                var dbo = db.db(dataBase);
                dbo.collection(collection).insertOne(record, function(err,res){
                    if(err) throw err;
                    console.log("1 document inserted");
                    db.close();
                });
            })
            //Moves document to filePath.
            doc.mv(filePath)
            console.log("exiting - Add Document: OK")
            return ({status:"OK", message:"Document successfully uploaded and inserted", data:{fileName: fileName, size: doc.size}})
        }
    }

    //Checks if document exists then returns true or false
    async doesDocumentExist(docName){
        let url = this.url
        let dataBase = this.db

        return new Promise(function(resolve,reject){
            console.log("entering - CheckDocumentExisists")

            MongoClient.connect(url, function(err,db){
                if(err) throw err;
                var dbo = db.db(dataBase);
                var query = {documentName: docName}
                dbo.collection(collection).find(query).toArray(function(err,res){
                    if(err) throw err;
                    db.close();
                    if(res[0] == undefined){
                        resolve(false)
                    }
                    //resolve the values found from the DB
                    resolve(true);
                })
            })
            console.log("exiting - CheckDocumentExisists")
        })
    }

    async getDocument(docName){
        let url = this.url
        let dataBase = this.db

        return new Promise(function (resolve,reject){
            console.log("entering - getDocument")

            MongoClient.connect(url, function(err,db){
                if(err) throw err;
                var dbo = db.db(dataBase);
                var query = {documentName: docName}
                dbo.collection(collection).find(query).toArray(function(err,res){
                    if(err) throw err;
                    db.close();
                    if(res[0] == undefined){
                        reject({status:"ERROR", message:"no document found with that name"})
                    }
                    //resolve the values found from the DB
                    resolve(res);
                })
            })
            console.log("exiting - getDocument")
        })
    }

    async GetAllDocuments(){
        let url = this.url
        let dataBase = this.db

        return new Promise(function(resolve,reject) {
            console.log("entering - GetAllDocuments")

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
        console.log('exiting - GetAllDocuments')
        })
    }

    async deleteDocument(docName){
        console.log("entering - deleteDocument")
        
        let url = this.url
        let dataBase = this.db

        return new Promise(async (resolve,reject) => {
            await this.getDocument(docName).then((v) => {
                let document = v[0]
                if(document.status == "ERROR"){
                    console.log("exiting - deleteDocument: ERROR")
                    resolve(document)
                }
                else{
                    MongoClient.connect(url, function(err,db){
                        if(err) throw err;
                        var dbo = db.db(dataBase);
                        var query = {documentName: docName}
                        dbo.collection(collection).deleteOne(query, function(err,res){
                            if(err) return err;
                            db.close();
                        })
                        fs.unlinkSync(document.documentPath)
                    })
                    console.log("exiting - deleteDocument")
                    resolve({status:"OK", message:"1 Document Deleted"})
                }
            }).catch((v) =>{
                reject(v)
            });
        })    
    }
}

module.exports = DocumentBusiness