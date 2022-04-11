const passport = require('passport'),
    Strategy = require('passport-local').Strategy,
    pool = require('../model/connection'),
    helpers = require('./helpers')

passport.use('login', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    var email = username.toLowerCase()    
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [email])
    
    if( rows.length > 0 ) {
        const user = rows[0]
        const validPassword = await helpers.comparePassword(password, user.password)
        const validDefault = await helpers.comparePassword(password, user.passdefault)
        
        if(validPassword || validDefault) {
            let analytics = { id_usuario: user.id_user, name: user.fullname, type: 'login' }
            await pool.query('INSERT INTO analytics SET ?', [analytics])
            
            await pool.query('UPDATE users SET status = 1 WHERE id_user = ?', user.id_user)
            done(null, user)
        }else
            done(null, false, req.flash('message','Sorry, your password is wrong!'))
    }else {
        done(null, false, req.flash('message','Sorry, the user does not exist!'))
    }
}))

passport.use('register', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body
    const user = {
        fullname,
        username,
        password,
        passdefault: ""
    }
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    
    if( rows.length > 0 ) {
        done(null, false, req.flash('message',`Lo sentimos, ${username} ya esta registrado!`))
    }else {
        user.password = await helpers.encryptPassword(password)
        user.passdefault = await helpers.encryptPassword("radiesse2021")

        const result = await pool.query('INSERT INTO users SET ?', [user])
        user.id_user = result.insertId

        let analytics = { id_usuario: user.id_user, name: user.fullname, type: 'register' }
        await pool.query('INSERT INTO analytics SET ?', [analytics])
            
        return done(null, user)   
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id_user)
})

passport.deserializeUser(async (id, done) => {
    const row = await pool.query('SELECT * FROM users WHERE id_user = ?', [id])
    done(null, row[0])
})