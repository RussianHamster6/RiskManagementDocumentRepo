const AB = require('./business/AccountBusiness')
const DB = require('./business/DocumentBusiness')

let accBus = new AB()
let docBus = new DB()

accBus.DeleteAccount('testUser');

docBus.deleteDocument('testDoc.txt')

console.log("Tests successfully cleaned up!")