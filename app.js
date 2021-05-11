const express = require('express');
const routes = require('./routes');
const {session: dbSession} = require('./config/database');
const passport = require('passport');
const crypto = require('crypto');
let pg = require('pg');

require('dotenv').config()
const app = express()
const port = 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(dbSession)

require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

app.use(routes)

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})