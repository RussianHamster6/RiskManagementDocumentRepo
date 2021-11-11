const test = require('ava');
const { response } = require('express');

//After tests have run some database cleanup is required. Any inserted values will need to be deleted although this will not negatively impact the performance of the application

//if you want these region tabs to work as they do for me see this VSCode extention: https://marketplace.visualstudio.com/items?itemName=maptz.regionfolder&ssr=false#overview

/* #region  Example Tests from docs */
/*test('foo', t => {
    t.pass();
});

test('bar', async t => {
    const bar = Promise.resolve('bar');
    t.is(await bar, 'bar');
});*/
/* #endregion */

/* #region AccountsBusiness Tests*/

const AccountBusiness = require('./business/AccountBusiness')
let accountBusiness; 
let fakeAccount

function setUpAccountBusinessTests(){
    accountBusiness = new AccountBusiness()
    fakeAccount = {
        body: {
            userName: "testUser",
            passwordHash: "5f4dcc3b5aa765d61d8327deb882cf99", //"password" as a plain md5 hash
            isAdmin: "false"
        }
    }
} 

//tests run serially as they need to happen before the other tests
//if this test fails it will negatively impact other tests
//AccountAdd happy path test
test.serial('AccountAddWithValidparamsThenSuccessTest', async t => {
    setUpAccountBusinessTests()
    let response = await accountBusiness.AddAccount(fakeAccount)
    t.is(response.status, 'OK')
    t.is(response.message, 'successfully inserted user')
})

//Account login happy path test
test('AccountLoginWithValidCredentialsThenSuccess', async t =>{
    setUpAccountBusinessTests()

    let response = await accountBusiness.userLogin('testUser','5f4dcc3b5aa765d61d8327deb882cf99')
    t.is(response.status, 'OK')
    t.is(response.message, 'login success')
    t.true(response.loginStatus)
})

//Account Login with invalid Password test
test('AccountLoginWithInvalidPasswordThenSuccessWithLoginSatusFalse', async t =>{
    setUpAccountBusinessTests()

    let response = await accountBusiness.userLogin('testUser','WRONG PASSWORD')
    t.is(response.status, 'OK')
    t.is(response.message, 'login fail')
    t.false(response.loginStatus)
})

//Account Login with invalid UserName test
test('AccountLoginWithInvalidUsernameThenError', async t =>{
    setUpAccountBusinessTests()

    await accountBusiness.userLogin('WRONG USER','password doesnt matter here').then((response) =>{
        t.fail()
    }).catch((response) => {
        t.is(response.status, 'ERROR')
        t.is(response.Error, 'No user found with that name')
    })
})

//AccountAdd error if duplicate user
test('AccountAddWithDuplicateUserNameThenErrorResponse', async t =>{
    setUpAccountBusinessTests()
    
    let response = await accountBusiness.AddAccount(fakeAccount)
    t.is(response.status, 'ERROR')
})

//Get All happy path test
test('AccountGetAllThenSuccess', async t => {
    setUpAccountBusinessTests()
    await accountBusiness.GetAllAccounts().then((response) => {
        t.is(response[response.length - 1].userName, 'testUser')
    })
})

//GetSpecificAccount happy path test
test('GetSpecificAccountWithValidRecordThenSuccess', async t => {
    setUpAccountBusinessTests()
    let response = await accountBusiness.GetSpecificAccount('testUser')
    t.is(response[0].userName, 'testUser')
})

//Update happy path test
test('AccountUpdateWithValidParamsThenSuccess', async t => {
    setUpAccountBusinessTests()
    fakeAccount.body.userName = 'updatedTestUser'
    let response = await accountBusiness.UpdateAccount('testUser', fakeAccount.body)
    t.is(response.status, 'OK')
    t.is(response.message, '1 Document Updated')
})

//Update non existant record test
test('AccountUpdateWithNonExisitentUserParamsThenError', async t => {
    setUpAccountBusinessTests()
    fakeAccount.body.userName = 'updatedTestUser'
    let response = await accountBusiness.UpdateAccount('GARBAGE', fakeAccount.body)
    t.is(response.status, 'ERROR')
})

//Delete happy path test
test('AccountDeleteWithValidAccountThenSuccess', async t => {
    setUpAccountBusinessTests()
    
    let response = await accountBusiness.DeleteAccount('testUser')
    t.is(response.status, 'OK')
    t.is(response.message, '1 Document Deleted' )
})

//Delete account with invalid user test
test('AccountDeleteWithInvalidAccountThenError', async t => {
    setUpAccountBusinessTests()
    
    let response = await accountBusiness.DeleteAccount('WRONG USER')
    t.is(response.status, 'ERROR')
    t.is(response.message, 'a record for this userID could not be found' )
})

/*test('AccountBusinessCreateAndGetThenDeleteTest', async t => {
    
})*/

/* #endregion */

/* #region DocumentBusiness Tests */
const DocumentBusiness = require('./business/DocumentBusiness')
let documentBusiness

function setUpDocumentBusinessTests(){
    documentBusiness = new DocumentBusiness()
}


//Document Add test not possible due to document and therefore will need to be performed manually before running tests
//The request to send will be shown as an image stored in the testStuff folder. If this is not done properly tests will not run

//Test to see if the doesDocumentExist successfully returns true when the document should exist
test('documentExistWhenDocumentNameIsValidThenTrue', async t =>{
    setUpDocumentBusinessTests()
    let result = await documentBusiness.doesDocumentExist('testDoc.txt')

    t.true(result)
})

//Test to see if the doesDocumentExist successfully returns false when the document should not exist
test('documentExistWhenDocumentNameIsInvalidThenFalse', async t =>{
    setUpDocumentBusinessTests()
    let result = await documentBusiness.doesDocumentExist('GARBAGE')

    t.false(result)
})

//Test to see if get Document returns the correct document when called
test('getDocumentReturnDocumentWhenValidDocumentName', async t => {
    setUpDocumentBusinessTests();
    let result = await documentBusiness.getDocument('testDoc.txt')

    t.is(result[0].documentName,'testDoc.txt')
})
//test to see if get document errors when invalid document name passed
test('getDocumentReturnERRORWhenInvalidDocumentName', async t => {
    setUpDocumentBusinessTests();
    await documentBusiness.getDocument('GARBAGE').then((response) =>{
        t.fail()
    }).catch((response) => {
        t.is(response.status, 'ERROR')
        t.is(response.message, 'no document found with that name')
    })

})

//get all documents working as normal
test('getAllDocumentsReturnsSuccess', async t => {
    setUpDocumentBusinessTests();
    await documentBusiness.GetAllDocuments().then((response) => {
        t.is(response[response.length - 1].documentName, 'testDoc.txt')
    })
})

test('deleteDocumentWithValidDocNameThenSuccess', async t => {
    setUpDocumentBusinessTests();
    
    let response = await documentBusiness.deleteDocument('testDoc.txt')
    t.is(response.status, 'OK')
    t.is(response.message, '1 Document Deleted' )
})
/* #endregion */