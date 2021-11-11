const fs = require('fs')
let file

fs.readFile('./testStuff/testTextDocForUnitTests.txt',function(err,data){
    file = data
})