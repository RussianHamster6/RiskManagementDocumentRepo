const test = require('ava');

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

function setUpAccountBusinessTests(){
    accountBusiness = new AccountBusiness()
} 

//tests run serially as they need to happen before the other tests
//if this test fails it will negatively impact other tests
test.serial('AccountAddWithValidparamsThenSuccessTest', async t => {
    setUpAccountBusinessTests()
    let fakeReq = {
        body: {
            userName: "testUser",
            passwordHash: "5f4dcc3b5aa765d61d8327deb882cf99", //"password" as a plain md5 hash
            isAdmin: "false"
        }
    }
    let response = await accountBusiness.AddAccount(fakeReq)
    t.is(response.status, 'OK')
    t.is(response.message, 'successfully inserted user')
})

/*test('AccountBusinessCreateAndGetThenDeleteTest', async t => {
    
})*/

/* #endregion */