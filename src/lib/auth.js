module.exports = {
    isLoggedIn(req, res, next) {
        if(req.isAuthenticated())
            next()
        else 
            res.redirect('/')
    },
    
    isAuthenticated(req, res, next) {
        if(!req.isAuthenticated()) {
            next()
        }else
            res.redirect('/schedule')
    }
}