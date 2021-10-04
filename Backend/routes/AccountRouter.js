const AccountBusiness  = require('../business/AccountBusiness');
let express = require('express');
let bodyParser = require('body-parser');
let router = express.Router();
const app = express()

//Middleware config
const jsonParser = bodyParser.json()
const urlEncodedParser = bodyParser.urlencoded({extended: false})
const accountBusiness = new AccountBusiness();
//Accounts Get all
router.get('/', function(req, res, next) {
  res.send('Accounts Get Hit');
});

//Accounts Post
router.post('/', jsonParser, function(req, res, next){
    console.log(req.body)
    //TODO: Validation
    //Request to business logic
    accountBusiness.AddAccount("We Do be Hitting tho")
    res.send('Accounts Post Hit');
})

//Export router
module.exports = router;