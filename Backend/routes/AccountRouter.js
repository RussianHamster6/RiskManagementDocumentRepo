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
    
    let user = new User(
      null,
      req.body.userName,
      req.body.passwordHash,
      req.body.passwordSalt
    );

    //TODO: Validation
    //Request to business logic
    accountBusiness.AddAccount(user)
    res.send('Accounts Post Hit');
})

//Export router
module.exports = router;