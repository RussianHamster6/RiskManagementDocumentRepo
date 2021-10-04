const express = require('express')
const AccountsRouter = require('./routes/AccountRouter')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/Accounts', AccountsRouter)

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
