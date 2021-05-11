const router = require('express').Router();
const db = require('../config/database');
const passport = require('passport');
const { genPassword: genPassword } = require('../lib/passwordUtils');

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get('/login', (req, res, next) => {
    res.render('../views/login')
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', successRedirect: '/user'}))

router.get('/register', async (req, res, next) => {
    res.status(200).render('../views/register', {messageData: {}});
});

router.post('/register', async(req, res, next) => {
    const messageData = {
        message : 'Username Already Exists',
        class : 'error'
    };

    let usernameExists = await db.query('SELECT exists (SELECT 1 FROM users WHERE username = $1 LIMIT 1)',[req.body.username])
        .catch(error => {
            console.log(error)
            messageData.message = 'Database Error, Please Try Again in a Few Minutes'
            res.render('../views/register',{messageData: messageData});
        }) ;

    if(usernameExists.rows[0].exists) {
        res.status(401)
        res.render('../views/register',{messageData: messageData});
    }else{
        await genPassword(req.body.username, req.body.password)
        response.set('location', '/login');
        response.status(301).send()
    }
})

router.get('/user', async(req, res, next) => {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        res.render('../views/user')
    } else {
        res.set('location', '/login');
        res.status(301).send()
    }
})

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

module.exports = router;