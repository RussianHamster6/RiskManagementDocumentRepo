const DocumentBusiness  = require('../business/DocumentBusiness');
let express = require('express');
let bodyParser = require('body-parser');
let router = express.Router();
const app = express();

//Middleware config
const jsonParser = express.json()
const urlEncodedParser = express.urlencoded({extended: false})

const documentBusiness = new DocumentBusiness();

//Upload new document
router.post('/', jsonParser, async (req,res) =>{
    //validate essential fields
    if (!req.files) {
        res.status(400).send({status:"ERROR", message:"You need to upload a file with key 'document'. No such file found in request."})
    }
    else if (!req.body.documentName || typeof req.body.documentName != "string"){
        res.status(400).send({status:"ERROR", message:"You need to include a document name in the request with parameter name 'documentName'"})
    }
    else if (!req.body.fileExtention || typeof req.body.fileExtention != "string"){
        res.status(400).send({status:"ERROR", message:"You need to include a file extention in the request with parameter name 'fileExtention'"})
    }
    else if (!req.body.expiryDate || typeof req.body.expiryDate != "string"){
        res.status(400).send({status:"ERROR", message:"You need to include a date in string format in the request with parameter name 'expiryDate'"})
    }
    else{
        //validate date 
        var dateToValidate = new Date(req.body.expiryDate)
        if(isNaN(dateToValidate.getDay())){
            res.status(400).send({status:"ERROR", message:"The Date you have sent is not in the correct format"})
        }
        else{
            await documentBusiness.AddDocument(req.files.document,req.body.documentName,req.body.fileExtention,req.body.expiryDate).then((result) => {
                if(result.status == "OK"){
                    res.send(result)
                }
                else{
                    res.status(500).send(result)
                }
            })
        }
    }
})

//download document
router.get('/download/:documentName', async (req,res) => {
    if(!req.params.documentName || typeof req.params.documentName != "string"){ 
        res.status(400).send({status:"ERROR", message:"You have not included a required parameter in the request"})
    }
    else{
        documentBusiness.getDocument(req.params.documentName).then((val) =>{
            res.download(val[0].documentPath)
        }).catch((val) => {
            res.status(500).send(val)
        })
    }
})

//get specific document details
router.get('/:documentName', async (req,res) => {
    if(!req.params.documentName || typeof req.params.documentName != "string"){ 
        res.status(400).send({status:"ERROR", message:"You have not included a required parameter in the request"})
    }
    else{
        documentBusiness.getDocument(req.params.documentName).then((val) =>{
            res.send(val[0])
        }).catch((val) => {
            res.status(500).send(val)
        })
    }
})

router.get('/', async (req,res) => {
    documentBusiness.GetAllDocuments().then((v) =>{
        res.send(v)
    })
})

router.delete('/:documentName', async (req,res) => {
    if(!req.params.documentName || typeof req.params.documentName != "string"){ 
        res.status(400).send({status:"ERROR", message:"You have not included a required parameter in the request"})
    }
    else{
        documentBusiness.deleteDocument(req.params.documentName).then((ret) =>{
            res.send(ret)
        }).catch((ret) => {
            console.log(ret)
            res.status(500).send(ret)
        })
    }
})

router.post('/update/:documentName', async (req,res) => {
    if(!req.params.documentName || typeof req.params.documentName != "string"){
        res.status(400).send({status:"ERROR", message:"You have not included a required parameter in the request"})
    }
    else if (!req.files) {
        res.status(400).send({status:"ERROR", message:"You need to upload a file with key 'document'. No such file found in request."})
    }
    else if (!req.body.documentName || typeof req.body.documentName != "string"){
        res.status(400).send({status:"ERROR", message:"You need to include a document name in the request with parameter name 'documentName'"})
    }
    else if (!req.body.fileExtention || typeof req.body.fileExtention != "string"){
        res.status(400).send({status:"ERROR", message:"You need to include a file extention in the request with parameter name 'fileExtention'"})
    }
    else if (!req.body.expiryDate || typeof req.body.expiryDate != "string"){
        res.status(400).send({status:"ERROR", message:"You need to include a date in string format in the request with parameter name 'expiryDate'"})
    }
    else{
        //validate date 
        var dateToValidate = new Date(req.body.expiryDate)
        if(isNaN(dateToValidate.getDay())){
            res.status(400).send({status:"ERROR", message:"The Date you have sent is not in the correct format"})
        }
        else{
            documentBusiness.deleteDocument(req.params.documentName).then( async (ret) =>{
                if(ret.status == "OK"){
                    await documentBusiness.AddDocument(req.files.document,req.body.documentName,req.body.fileExtention,req.body.expiryDate).then((result) => {
                        if(result.status == "OK"){
                            res.send(result)
                        }
                        else{
                            res.status(500).send(result)
                        }
                    })
                }
            }).catch((v) =>{
                res.status(500).send(v)
            })
        }
    }
})

//Export router
module.exports = router;