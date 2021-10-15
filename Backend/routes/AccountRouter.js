const AccountBusiness  = require('../business/AccountBusiness');
let express = require('express');
let bodyParser = require('body-parser');
let router = express.Router();
const app = express();

//Middleware config
const jsonParser = express.json()
const urlEncodedParser = express.urlencoded({extended: false})
const accountBusiness = new AccountBusiness();
//Accounts Get all
router.get('/', async (req, res) => {
  //async to wait for v v to come back from GetAllAccounts
  accountBusiness.GetAllAccounts().then(function(v){
    res.send(v)
  })
});

//Account Get Specified Account
router.get('/:userId', async (req, res) => {
  accountBusiness.GetSpecificAccount(req.params.userId).then(function(v){
    res.send(v);
  });
})

//Accounts Post
router.post('/', jsonParser, async (req, res) => {
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
    //Request to business logic
    accountBusiness.AddAccount(req).then(function(){
      res.send('successfully inserted user')
    })
    }
})

//Export router
module.exports = router;