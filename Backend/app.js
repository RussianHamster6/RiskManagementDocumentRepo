const express = require('express')
const AccountsRouter = require('./routes/AccountRouter')
const DocumentRouter = require('./routes/DocumentRouter')
const app = express()
const port = 3000
const fileUpload = require('express-fileupload')
const cors = require('cors');

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors({
  origin: '*',
  methods: ['GET','POST','DELETE']
}))

app.use('/Accounts', AccountsRouter)
app.use('/Documents', DocumentRouter)

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
