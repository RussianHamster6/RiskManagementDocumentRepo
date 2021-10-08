const AccountBusiness  = require('../business/AccountBusiness');
const User = require('../models/users')
let express = require('express');
let bodyParser = require('body-parser');
let router = express.Router();
const app = express();

//Middleware config
const jsonParser = express.json()
const urlEncodedParser = express.urlencoded({extended: false})
const accountBusiness = new AccountBusiness();
//Accounts Get all
router.get('/', function(req, res, next) {
  res.send('Accounts Get Hit');
});

//Accounts Post
router.post('/', jsonParser, function(req, res, next){
    
    //Validate request
    if(!req.body.userName || typeof req.body.userName != "string"){
      res.status(400).send({"error":"Username is invalid"})
    }
    else if(!req.body.passwordHash || typeof req.body.passwordHash != "string"){
      res.status(400).send({"error":"passwordHash is invalid"})
    }
    else if(!req.body.passwordSalt || typeof req.body.passwordSalt != "string"){
      res.status(400).send({"error":"passowordSalt is invalid"})
    }
    //Request Valid run logic
    else{
    //creates object of User to pass to business
    let user = new User(
      null,
      req.body.userName,
      req.body.passwordHash,
      req.body.passwordSalt
    );

    //Request to business logic
    accountBusiness.AddAccount(user)
    res.send('Accounts Post Hit');
    }
})

//Export router
module.exports = router;