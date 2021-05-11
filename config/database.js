let pg = require('pg');
let session = require('express-session');
let pgSession = require('connect-pg-simple')(session);

require('dotenv').config();

var pgPool = new pg.Pool({
  	user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: 'null',
    port: process.env.PGPORT,
})

module.exports = {
    query: async(text, params) => {
      return pgPool.query(text, params)
    },
    session: session({
      store: new pgSession({
        pool : pgPool,
      }),
      saveUninitialized: true,
      secret: process.env.PGPASSWORD,
      resave: false,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } 
    })
}