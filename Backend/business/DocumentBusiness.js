require('../models/document')
const BusinessBase = require('./businessBase')
const Document = require('../models/document')
const MongoClient = require('mongodb').MongoClient;
const collection = "documents"

class DocumentBusiness extends BusinessBase{
    
    constructor()
    {
        super();
    }

    async AddDocument(doc,fileName,fileExtention,expiryDate){
        console.log("entering - Add Document")
    try{
        //await checkDocNameIsUnique...
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
        console.log(fileName)
        let record = new Document(fileName,filePath,expiryDate)

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
    catch (error){
        console.log("entering - Add Document: Error")
        return({status:"ERROR", message:error})
    }


    }
}

module.exports = DocumentBusiness