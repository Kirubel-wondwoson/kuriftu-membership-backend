const express = require('express')
const connectDB = require('./src/config/db')

const app = express()
const port = 3000;

connectDB();

app.use(express.json())
app.use(express.json({extended: false}))

app.use('/api/auth', require('./src/routes/auth.routes'))
app.use('/api/user', require('./src/routes/user.routes'))
app.use('/api/loyalty', require('./src/routes/loyalty.routes'))
app.use('/api/reward', require('./src/routes/reward.routes'))
app.use('/api/membership', require('./src/routes/membership.routes'))
 
app.listen(port, () => {
  console.log('Server is running on port 3000')
})