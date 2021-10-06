class businessBase{

    constructor(){
        this.url = "mongodb://localhost:27017/"
        this.db = "RiskManagmentDocumentRepo"
    }

    //Finds the next id that has not been used in the DB
    //Param - Table - name of table to lookup on
    idLookup(table){
        //TODO: Logic
    }
}

module.exports = businessBase