const express = require('express'),
    router = express.Router(),
    pool = require('../model/connection'),
    passport = require('passport'),
    { isLoggedIn, isAuthenticated } = require('../lib/auth'),
    shortid = require('shortid')

    
router
    .post('/signup', isAuthenticated, passport.authenticate('register', {
        successRedirect: '/schedule',
        failureRedirect: '/signup',
        failureFlash: true
    }))
    .get('/', isAuthenticated,  (req, res) => {
        res.render('auth/signin', {layout: 'welcome.hbs'})
    })
    .get('/signup', isAuthenticated,  (req, res) => {
        res.render('auth/register', {layout: 'welcome.hbs'})
    })
    .post('/signin', isAuthenticated, (req, res, next) => {
        passport.authenticate('login', {
            successRedirect: '/schedule',
            failureRedirect: '/',
            failureFlash: true
        })(req, res, next)
    })
    .get('/logout', isLoggedIn, async(req, res) => {
        let user = req.user
        let analytics = { id_usuario: user.id_user, name: user.fullname, type: 'logout' }
        await pool.query('INSERT INTO analytics SET ?', [analytics])

        req.logOut()
        res.redirect('/')
    })
    
module.exports = router