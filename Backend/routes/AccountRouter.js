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
  }).catch(function(v){
    res.status(400).send(v);
  });
})

//Accounts Post
router.post('/', jsonParser, async (req, res) => {
    //Validate request
    if(!req.body.userName || typeof req.body.userName != "string" || req.body.userName.length < 4){
      res.status(400).send({"error":"Username is invalid"})
    }
    else if(!req.body.passwordHash || typeof req.body.passwordHash != "string" || req.body.passwordHash == "d41d8cd98f00b204e9800998ecf8427e"){
      res.status(400).send({"error":"passwordHash is invalid"})
    }
    else if(!req.body.passwordSalt || typeof req.body.passwordSalt != "string"){
      res.status(400).send({"error":"passowordSalt is invalid"})
    }
    else{
    //Request to business logic
    await accountBusiness.AddAccount(req).then((result) => {
      if(result.status == "OK"){
        res.send(result)
      }
      else{
        res.status(400).send(result)
      }
    })
  }
})

router.post('/update/:userId', jsonParser, function (req,res) {
  if(!req.body.userName || typeof req.body.userName != "string" || req.body.userName.length < 4){
    res.status(400).send({"error":"Username is invalid"})
  }
  else if(!req.body.passwordHash || typeof req.body.passwordHash != "string" || req.body.passwordHash == "d41d8cd98f00b204e9800998ecf8427e"){
    res.status(400).send({"error":"passwordHash is invalid"})
  }
  else if(!req.body.passwordSalt || typeof req.body.passwordSalt != "string"){
    res.status(400).send({"error":"passowordSalt is invalid"})
  }
  else if(!req.params.userId || typeof req.params.userId != "string" || req.body.userId.length < 4){
    res.status(400).send({"error":"The user you are trying to updaate is invalid"})
  }
  else{
    accountBusiness.UpdateAccount(req.params.userId,req.body).then((result) => {
      if(result.status == "OK"){      
        res.send(result)
      }
      else{
        res.status(400).send(result)
      }
    }).catch((error) => {
      res.send(error)
    })
  }
})

router.delete('/:userId', async (req,res) => {
  if(!req.params.userId || typeof req.params.userId != "string"){
    res.status(400).send({"error":"The user you are trying to delete is invalid"})
  }
  else{
    accountBusiness.DeleteAccount(req.params.userId).then((result) => {
      if(result.status == "OK"){      
        res.send(result)
      }
      else{
        res.status(400).send(result)
      }
    }).catch((error) => {
      res.send(error)
    })
  }
})

router.post('/login', jsonParser,async (req,res) => {
  if(!req.body.userName || typeof req.body.userName != "string"){
    res.status(400).send({"error":"Username is invalid"})
  }
  else if(!req.body.passwordHash || typeof req.body.passwordHash != "string"){
    res.status(400).send({"error":"passwordHash is invalid"})
  }
  else{
    await accountBusiness.userLogin(req.body.userName,req.body.passwordHash).then((result) => {
      res.send(result);
    }).catch((result) => {
      res.status(400).send(result)
    })
  }
})

//Export router
module.exports = router;