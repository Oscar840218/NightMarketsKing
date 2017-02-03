var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost/loginapp';
var date = new Date();


router.get('/new', function(req, res, next) {
    res.render('markets_information/market_components/comment/new_comment', {
        title: 'Express',
    });
});

router.post('/newData',function (req,res) {
    var vendor = req.body.vendorName;
    var name = req.body.userName;
    var score = req.body.score;
    var comment = req.body.comment;
    var time = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate();


    var ok = check_data(name,comment);
    console.log(vendor);
    if(ok){
        var item = {
            vendor:vendor,
            name:name,
            msg:comment,
            score:score,
            date:time
        };
        mongo.connect(url,function (err,db) {
           assert.equal(null,err);
           db.collection('message').insertOne(item,function (err,result) {
               assert.equal(null,err);
               console.log('item inserted');
               db.close();
           });
        });

        res.redirect('http://128.199.118.143:3000/areas/vendors?vendorName='+vendor);

    }else{
        res.render('markets_information/market_components/comment/new_comment',{vendor:vendor,err:'填寫資料錯誤!'});
        if (req.session.state) { //防止res.end()重複發生
            res.redirect('/comment/new');
        }
    }

});

router.post('/newPage',function (req,res) {
    var vendor = req.body.vendor;

    res.render('markets_information/market_components/comment/new_comment',{vendor:vendor,err:''});
    if (req.session.state) { //防止res.end()重複發生
        res.redirect('/comment/new');
    }
});


function check_data(data,comment) {
    var pass = Boolean(1);
    var words_name = [];
    words_name = data.split("");
    words_name.forEach(function (w) {
        if(w=='!' || w=='@'|| w=='#'|| w=='$'|| w=='%'|| w=='^'|| w=='&' || w=='*'|| w=='('|| w==')' || w=='-'|| w=='+'|| w==',' || w=='~' || w==' '){
            pass = Boolean(0);
        }
    });
        if(comment=="" || comment==" "){
            pass = Boolean(0);
        }

    return pass;
}

module.exports = router;

