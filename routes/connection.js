var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('connection', {
        title: 'first'
    });

});

router.get('/introduction', function(req, res, next) {
    res.render('introduction', {
        title: 'first'
    });

});

function loadUser(req, res, next) {
    if (req.params.userId) {

        console.log('Is user');

       next();
    } else {

        console.log("no user");

        next();
    }
}

module.exports = router;

