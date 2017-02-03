var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost/loginapp';


router.get('/', function(req, res, next) {
    var length;
    mongo.connect(url,function (err,db) {
        assert.equal(null,err);
        var resultArray = [];
        var cursor = db.collection('promotion').find();
        cursor.forEach(function (doc,err) {
            assert.equal(null,err);
            resultArray.push(doc);
        },function () {
            db.close();
            length = resultArray.length;
            res.render('promotion/promotion_info', {
                title: 'Express',
                totalRecords:length,
                size:10
            });
        })
    });
});

router.get('/getData',function (req,res) {
    mongo.connect(url,function (err,db) {
        assert.equal(null,err);
        var page = parseInt(req.query.page),
            size = parseInt(req.query.size),
            skip = page > 0 ? ((page - 1) * size) : 0;
       var resultArray = [];
       var cursor = db.collection('promotion').find(null,null,{
            skip:skip,
            limit:size
           }
       );
       cursor.forEach(function (doc,err) {
           assert.equal(null,err);
           resultArray.push(doc);
       },function () {
           db.close();
           res.json({data:resultArray});
       });

    });
});


router.get('/register',ensureAuthenticated,function (req,res) {
    let date = new Date();
    let today = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    res.render('promotion/register', {
        err:null,
        today:today
    });
});

router.post('/register',function (req,res) {
    let date = new Date();
    let today = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    let activityName = req.body.activityName;
    let content = req.body.content;
    let start_time = req.body.start_time;
    let end_time =  req.body.end_time;
    let ok = check_data(activityName,content);
    if(start_time<today){
        res.render('promotion/register',{err:'開始日期小於今天!',today:today});
        if (req.session.state) { //防止res.end()重複發生
            res.redirect('/promotion/register');
        }
    }else if(start_time>end_time){
        res.render('promotion/register',{err:'日期設定錯誤!',today:today});
        if (req.session.state) { //防止res.end()重複發生
            res.redirect('/promotion/register');
        }
    }else if(!ok){
        res.render('promotion/register',{err:'請填寫正確內容!',today:today});
        if (req.session.state) { //防止res.end()重複發生
            res.redirect('/promotion/register');
        }
    }else{
        let item = {
            vendor_name:req.user.vendor,
            activity_name:activityName,
            type:req.user.select_category,
            image:req.user.image,
            start_time:start_time,
            end_time:end_time,
            content:content
        };
        mongo.connect(url,function (err,db) {
            assert.equal(null,err);
            db.collection('promotion').insertOne(item,function (err,result) {
                assert.equal(null,err);
                console.log('item inserted');
                db.close();
            });
        });
        res.redirect('/promotion');
    }
});




function ensureAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg','尚未登入狀態');
        res.redirect('/users/login');
    }
}

function check_data(name,cotent) {
    var pass = Boolean(1);
    var words_name = [];
    words_name = name.split("");
    var nameChecker = /^[0-9|a-z|A-z]/;
    words_name.forEach(function (w) {
        if(w=='!' || w=='@'|| w=='#'|| w=='$'|| w=='%'|| w=='^'|| w=='&' || w=='*'|| w=='('|| w==')' || w=='-'|| w=='+'|| w==',' || w=='~' || w==' '){
            pass = Boolean(0);
        }
    });
    if(cotent=="" || cotent==" "){
        pass = Boolean(0);
    }

    return pass;
}

module.exports = router;

