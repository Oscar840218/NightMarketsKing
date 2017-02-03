var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost/loginapp';

router.get('/north-area', function(req, res, next) {
    res.render('markets_information/areas', {
        area:'north'
    });
});

router.get('/mid-area', function(req, res, next) {
    res.render('markets_information/areas', {
        area:'mid'
    });
});

router.get('/south-area', function(req, res, next) {
    res.render('markets_information/areas', {
        area:'south'
    });
});

router.get('/east-area', function(req, res, next) {
    res.render('markets_information/areas', {
        area:'east'
    });
});

router.get('/comment',function (req,res) {
    res.render('comment', {
        title: 'Express'
    });
});

router.get('/info',function (req,res,next) {

    let name = req.param('market_name');
    let local_area = req.param('local_area');
    let resultArray = [];
    mongo.connect(url,function (err,db) {
        assert.equal(null,err);
        let cursor = db.collection('users').find({"market":name});
        cursor.forEach(function (doc,err) {
            assert.equal(null,err);
            resultArray.push(doc);
        },function () {
            db.close();
            res.render('markets_information/information',{items:resultArray,name:name,local_area:local_area});
        });
    });

});

router.get('/vendors',function (req,res,next) {
    let vendor_name = req.param('vendorName');
    let resultArray_vendor = [];
    let resultArray_comment = [];
    let resultArray_activity = [];
    let resultArray_products = [];

    mongo.connect(url,function (err,db) {
        assert.equal(null,err);
        let cursorVendor = db.collection('users').find({"vendor":vendor_name});
        let cursorComment = db.collection('message').find({"vendor":vendor_name});
        let cursorActivity = db.collection('promotion').find({"vendor_name":vendor_name});
        let cursorProducts = db.collection('products').find({"vendorName":vendor_name});

        cursorVendor.forEach(function (doc,err) {
            assert.equal(null,err);
            resultArray_vendor.push(doc);
        });

        cursorProducts.forEach(function (doc,err) {
            assert.equal(null,err);
            resultArray_products.push(doc);
        });

        cursorActivity.forEach(function (doc,err) {
           assert.equal(null,err);
           resultArray_activity.push(doc);
        });

        cursorComment.forEach(function (doc,err) {
            assert.equal(null,err);
            resultArray_comment.push(doc);
        },function () {
            db.close();

            res.render('markets_information/vendors_information',{
                name: vendor_name,
                items: resultArray_vendor,
                activities: resultArray_activity,
                products: resultArray_products,
                comments: resultArray_comment
            });

        });
    });

});

router.get('/QR_generator',function (req,res) {
    let vendor_name = req.param("QR_info");
    res.render('users/QR_generator',{QR_info:`http://localhost:3000/areas/vendors?vendorName=${vendor_name}`});
});



module.exports = router;

