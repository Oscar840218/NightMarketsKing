var express = require('express');
var router = express.Router();


router.get('/markets', function(req, res, next) {
    res.render('popular/popular_markets', { title: 'Express' });
});

router.get('/vendors', function(req, res, next) {
    res.render('popular/popular_vendors', { title: 'Express' });
});


module.exports = router;

