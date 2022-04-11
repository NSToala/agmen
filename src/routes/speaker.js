const express = require('express'),
    router = express.Router()

router
    .get('/es/wordcloud', (req, res) => {
        res.render('speaker/wordcloud', {layout: 'tvotacion'})
    })
    .get('/es/vote', (req, res) => {
        res.render('speaker/votacion', {layout: 'tvotacion'})
    })
    .get('/es/filter', (req, res) => {
        res.render('speaker/filtro', {layout: 'tvotacion'})
    })
    .get('/es/expert', (req, res) => {
        res.render('speaker/experto', {layout: 'tvotacion'})
    })
    .get('/es/', (req, res) => {
        res.render('speaker/votacion', {layout: 'tvotacion'})
    })
module.exports = router