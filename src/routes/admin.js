const express = require('express'),
      router = express.Router()
    
router
    .get('/',(req, res) => res.render('admin/dashboard', {layout: 'admin.hbs'}))
    .get('/votacion',(req, res) => res.render('admin/votacion', {layout: 'admin.hbs'}))
    .get('/wordcloud',(req, res) => res.render('admin/wordcloud', {layout: 'admin.hbs'}))
    .get('/preguntas',(req, res) => res.render('admin/preguntas', {layout: 'admin.hbs'}))

module.exports = router