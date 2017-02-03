var express = require('express');
var router = express.Router();

var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost/loginapp';

var fs = require('fs');
var dir;

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({storage:storage});


router.get('/products_control',ensureAuthenticated, function(req, res, next) {
    var vendorName = req.user.vendor;
    dir = 'public/uploads/'+ vendorName;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    mongo.connect(url,function (err,db) {
        assert.equal(null,err);
        var resultArray = [];
        var cursor = db.collection('products').find({"vendorName":req.user.vendor});
        cursor.forEach(function (doc,err) {
            assert.equal(null,err);
            resultArray.push(doc);
        },function () {
            db.close();
            res.render('markets_information/market_components/products/user_products_menu', {
                items:resultArray
            });
        })

    });
});

router.get('/add_product',ensureAuthenticated,function (req,res) {
   res.render('markets_information/market_components/products/products_control',{err:null});
});

router.post('/add_product',upload.single('image'),function (req,res) {
    var product_name = req.body.name;
    var price = req.body.price;
    var introduction = req.body.introduction;

    if(product_name==' ' || price.length==' ' || introduction.length==' ' || req.file==null){
        res.render('markets_information/market_components/products/products_control',{err:"請輸入完整!"});
        if (req.session.state) { //防止res.end()重複發生
            res.redirect('/products/add_product');
        }
    }else{
        var item = {
            vendorName:req.user.vendor,
            product_name:product_name,
            price:price,
            image:req.file.originalname,
            introduction:introduction
        };
        mongo.connect(url,function (err,db) {
            assert.equal(null,err);
            db.collection('products').insertOne(item,function (err,result) {
                assert.equal(null,err);
                console.log('item inserted');
                db.close();
            })
        });
        res.redirect('/products/products_control');
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

module.exports = router;

