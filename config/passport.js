const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../config/database');
const { validatePassword: validatePassword } = require('../lib/passwordUtils');

const verifyCallback = async (username, password, done) => {
    queryData = await db.query('SELECT * FROM users WHERE LOWER(users.username)= LOWER($1)',[username])
        .catch(error => {
            console.log(error)
            done(error)
        })
    if(queryData.rows.length === 0) return done(null, false)
    const user = queryData.rows[0]

    //TODO: CODE RUNS BEFORE AWAIT RETURNS A VALUE, FIND A WAY TO FIX
    const isValid = await validatePassword(password, user.hash)

    console.log('first isValid', isValid)
    if(isValid) return done(null, user)
    return done(null, false)
}

const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy)

passport.serializeUser((user,done) => {
    console.log('serialize user called')
    done(null, user.id)
})

passport.deserializeUser(async (userId, done) => {
    console.log('deserialize user called')
    //maker userID instead of first_name
    queryData = await db.query('SELECT * FROM users WHERE users.id= $1',[userId])
        .catch(error => {
            console.log(error)
            done(error)
        })
    const user = queryData.rows[0]
    done(null, user)
})

module.exports = {verify: verifyCallback}