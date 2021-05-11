const bcrypt = require('bcrypt');
const db = require('../config/database');

const genPassword = async (username, password) => {
    console.log(typeof(password))
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        console.log(hash)
        console.log('typeofhash', typeof(hash))
        db.query('INSERT INTO users (username, hash) VALUES ($1, $2)', [username, hash])
            .catch(error => console.log(error)) 
    });
}

const validatePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

module.exports = {
    genPassword: genPassword,
    validatePassword: validatePassword
}