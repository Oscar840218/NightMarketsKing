var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost/loginapp';

router.get('/chart_info', function(req, res, next) {
    res.render('charts/chart_info', {
        title: 'Express'
    });
});

router.get('/draw_pie_chart', function(req, res, next) {
    res.render('charts/draw_pie_chart', {
        title1: 'Express'
    });
});

router.get('/draw_area_chart', function(req, res, next) {
    res.render('charts/draw_area_chart', {
        title1: 'Express'
    });
});


router.post('/type',function (req,res) {
   var type = req.body.chart_type;
   if(type!=null){
       res.render('charts/chart_info',{type:type,err:null});
       if (req.session.state) { //防止res.end()重複發生
           res.redirect('/chart/chart_info');
       }
   }
});

router.post('/storeData',function (req,res) {
    var type = req.body.type;
    switch (type){
        case '圓餅圖':
            var sum=0;
            req.body.numbers.forEach(function (num) {
                sum = +sum + +num;
            });
            if(sum!=req.body.total){
                res.render('chart_info',{type:type,err:"總數與項目數量不符!"});
                if (req.session.state) { //防止res.end()重複發生
                   res.redirect('/chart/chart_info');
                }
            }else{
                let item = {
                    Type:type,
                    User:req.user.username,
                    Title:req.body.title,
                    Date:req.body.date,
                    Sum:sum,
                    items:req.body.items,
                    numbers:req.body.numbers
                };
                mongo.connect(url,function (err,db) {
                    assert.equal(null,err);
                    db.collection('charts').insertOne(item,function (err,result) {
                        assert.equal(null,err);
                        console.log('item inserted');
                        db.close();
                    });
                });
                res.redirect('/users/user_control_page');
            }
            break;
        case '長條圖':

            break;
        case '區域圖':
            let item = {
                Type:type,
                User:req.user.username,
                Title:req.body.title,
                Date:req.body.date,
                Period:req.body.period,
                items:req.body.items,
                numbers_income:req.body.numbers_income,
                numbers_cost:req.body.numbers_cost
            };
            mongo.connect(url,function (err,db) {
                assert.equal(null,err);
                db.collection('charts').insertOne(item,function (err,result) {
                    assert.equal(null,err);
                    console.log('item inserted');
                    db.close();
                });
            });
            res.redirect('/users/user_control_page');
            break;
        case '表單':

            break;
    }
});

router.post('/removeData',function (req,res) {
    var id = req.body.id;
    mongo.connect(url,function (err,db) {
        assert.equal(null,err);
        db.collection('charts').deleteOne({"_id":ObjectId(id)},function (err,result) {
            assert.equal(null,err);
            console.log('item deleted');
            db.close();
        });
    });
    res.redirect('/users/user_control_page');
});


router.post('/draw',function (req,res) {
   var type = req.body.type;
   switch(type){
       case '圓餅圖':
           var array_items = [];
           var array_numbers = [];
           var array_result = [];
           var sum =req.body.sum;
           array_items = req.body.items.split(",");
           array_numbers = req.body.numbers.split(",");
           array_numbers.forEach(function (num) {
               array_result.push( (+num / +sum)*100);
           });

           res.render('charts/draw_pie_chart',{
               type:type,
               title:req.body.title,
               date:req.body.date,
               sum:sum,
               items:array_items,
               numbers:array_result,
               original_numbers:array_numbers
           });

           if (req.session.state) { //防止res.end()重複發生
               res.redirect('/chart/draw_pie_chart');
           }
           break;
       case '長條圖':

           break;
       case '區域圖':
            var array_items3 = [];
            var array_numbers_income = [];
            var array_numbers_cost =  [];
            array_items3 = req.body.items.split(",");
            array_numbers_income = req.body.numbers_income.split(",");
            array_numbers_cost = req.body.numbers_cost.split(",");
            console.log(req.body.numbers_income);
            res.render('charts/draw_area_chart',{
                   type:type,
                   title:req.body.title,
                   date:req.body.date,
                   period:req.body.period,
                   items:array_items3,
                   numbers_income:array_numbers_income,
                   numbers_cost:array_numbers_cost
            });
           if (req.session.state) { //防止res.end()重複發生
               res.redirect('/chart/draw_area_chart');
           }

           break;
       case '表單':

           break;
   }

});


module.exports = router;

