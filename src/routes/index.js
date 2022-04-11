const express = require('express'),
    pool = require('../model/connection'),
    helpers = require('../lib/helpers'),
    router = express.Router(),
    { isLoggedIn, isLoggedInPor, isAuthenticated } = require('../lib/auth')

router
    .get('/wordcloud', (req, res) => {
        res.render('pages/wordcloud')
    })
    .get('/speakers', isLoggedIn, async(req, res) => {
        res.render('pages/speakers')
    })
    .get('/expert', isLoggedIn, async(req, res) => {
        res.render('pages/expert')
    })
    .get('/schedule', isLoggedIn, async(req, res) => {
        let user = req.user
        
        if(user != undefined) {
            let analytics = { id_usuario: user.id_user, name: user.fullname, type: 'refresh' }
            await pool.query('INSERT INTO analytics SET ?', [analytics])
        }
        res.render('pages/schedule')
    })
module.exports = router