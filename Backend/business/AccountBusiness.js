require('../models/users')
const BusinessBase = require('./businessBase')

class AccountBusiness extends BusinessBase{

    constructor()
    {
        super();
    }

    //Add Account logic
    AddAccount(newAccount){
        console.log('entering - AddAccount')
        //TODO: Create logic to find last id in mongoDB
        //idLookup();
        
        /*let lookupID = 0

        let user = new User(
            lookupID,
            newAccount.name,
            newAccount.passwordHash,
            newAccount.passwordSalt);
        */
        
        console.log(newAccount)
        console.log('exiting - AddAccount')
    }

}

module.exports = AccountBusiness
