var express = require('express');
var router = express.Router();
var fs = require('fs');
var assert = require('assert');
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/******************Muter********************************************/
//Multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({storage:storage});

/******************DataBase********************************************/
//Connect Database
var url = 'mongodb://localhost/loginapp';
var mongo = require('mongodb').MongoClient;
var mongoose = require('mongoose');
mongoose.connect(url);
var Schema = mongoose.Schema;

var userChartDataSchema = new Schema({
    _id:String,
    Type:{type:String,required:true},
    User:String,
    Title:String,
    Date:String,
    Sum:Number,
    Period:String,
    items:[],
    numbers:[],
    numbers_income:[],
    numbers_cost:[]
},{collection:'charts'});

var userActivitiesSchema = new Schema({
    _id:String,
    vendor_name:String,
    activity_name:String,
    start_time:String,
    end_time:String,
    content:String
},{collection:'promotion'});

var UserChartData = mongoose.model('UserChartData',userChartDataSchema);
var UserActivityData = mongoose.model('UserActivityData',userActivitiesSchema);

/******************Register********************************************/
router.get('/register', function(req, res, next) {
    res.render('users/register', { errors: null });
});

//Register User
router.post('/register',upload.single('image'),function(req, res) {

    //Get Data
    let username = req.body.userName;
    let password = req.body.password;
    let password_hint = req.body.password_hint;
    let vendor = req.body.vendor;
    let email = req.body.email;
    let imageName;
    let select_category = req.body.select_category;
    let market = req.body.market;
    let introduction = req.body.introduction;
    let address = req.body.address;
    let zip = req.body.zip;
    let phone = req.body.phone;
    let vendor_phone = req.body.vendor_phone;
    let cellphone = req.body.cellphone;
    let gender = req.body.Gender;
    let payment = req.body.payment;
    let news = req.body.NEWS;
    if(req.file==null){
        imageName = "";
    }else{
        imageName = req.file.originalname;
    }

    //Validation
    req.checkBody('email','Email格式不正確').isEmail();
    req.checkBody('password','在確認密碼不正確').equals(req.body.password_again);

    var errors = req.validationErrors();
    if(errors){
        res.render('users/register',{
            errors:errors
        });
    }else{
        var newUser = new User({
            username:username,
            password:password,
            password_hint:password_hint,
            vendor:vendor,
            email:email,
            image:imageName,
            select_category:select_category,
            market:market,
            introduction:introduction,
            address:address,
            zip:zip,
            phone:phone,
            vendor_phone:vendor_phone,
            cellphone:cellphone,
            gender:gender,
            payment:payment,
            news:news
        });

        User.createUser(newUser,function (err,user) {
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg',"註冊成功!");

        res.redirect('/users/login');
    }
});



/********************UpDate**********************************************/
router.get('/updatePage', ensureAuthenticated ,function (req,res) {
   res.render('users/update',{ errors:null });
});

router.post('/updatePage',function (req,res) {
    var type = req.body.type;
    res.render('users/update',{
        errors:null,
        type:type,
        username:req.user.username,
        vendorName:req.user.vendor,
        image:req.user.image,
        email:req.user.email,
        category:req.user.select_category,
        market:req.user.market,
        introduction:req.user.introduction,
        address:req.user.address,
        zip:req.user.zip,
        phone:req.user.phone,
        cellphone:req.user.cellphone
    });
    if (req.session.state) { //防止res.end()重複發生
        res.redirect('/users/updatePage');
    }
});

router.post('/update_user',function (req,res) {
        var username = req.body.userName;
        var email = req.body.email;
        var address = req.body.address;
        var zip = req.body.zip;
        var phone = req.body.phone;
        var cellphone = req.body.cellphone;
        var payment = req.body.payment;
        var news = req.body.NEWS;
        if(payment==null){
            payment = req.user.payment;
        }

        req.checkBody('email','Email格式不正確').isEmail();

        var errors_user = req.validationErrors();
        if(errors_user){
            res.render('users/update',{
                errors:errors_user,
                type:req.body.type,
                username:req.user.username,
                vendorName:req.user.vendor,
                image:req.user.image,
                email:req.user.email,
                category:req.user.select_category,
                market:req.user.market,
                introduction:req.user.introduction,
                address:req.user.address,
                zip:req.user.zip,
                phone:req.user.phone,
                cellphone:req.user.cellphone
            });
            if (req.session.state) { //防止res.end()重複發生
                res.redirect('/users/updatePage');
            }
        }else{
            mongo.connect(url,function (err,db) {
                assert.equal(null,err);
                db.collection('charts').updateMany(
                    {"User":req.user.username},
                    {
                        $set:{"User":username}
                    }
                );
                db.close();
            });


            User.getUserById(req.user._id,function (err,doc) {
                if(err){
                    console.log("error!Not found!");
                }
                doc.username = username;
                doc.email = email;
                doc.address = address;
                doc.zip = zip;
                doc.phone = phone;
                doc.cellphone = cellphone;
                doc.payment = payment;
                doc.news = news;
                doc.save();
            });

            res.redirect('/users/user_control_page');
        }
});

router.post('/update_vendor',upload.single('image'),function (req,res) {
    var vendor = req.body.vendor;
    var select_category = req.body.select_category;
    var market = req.body.market;
    var introduction = req.body.introduction;
    var imageName;
    if(req.file==null){
        imageName = req.user.image;
    }else if(req.file.originalname!=req.user.image){
        fs.unlink('public/uploads/'+req.user.image, (err) => {
            if (err) throw err;
            console.log('successfully deleted');
        });
    }

    req.checkBody('vendor','請填寫店家名稱').notEmpty();
    req.checkBody('market','請填寫所在夜市名稱').notEmpty();
    req.checkBody('introduction','請填寫店家介紹').notEmpty();

    var errors_vendor = req.validationErrors();
    if(errors_vendor){
        res.render('users/update',{
            errors:errors_vendor,
            type:req.body.type,
            username:req.user.username,
            vendorName:req.user.vendor,
            image:req.user.image,
            email:req.user.email,
            category:req.user.select_category,
            market:req.user.market,
            introduction:req.user.introduction,
            address:req.user.address,
            zip:req.user.zip,
            phone:req.user.phone,
            cellphone:req.user.cellphone
        });
        if (req.session.state) { //防止res.end()重複發生
            res.redirect('/users/updatePage');
        }
    }else{

        mongo.connect(url,function (err,db) {
            assert.equal(null,err);
            db.collection('promotion').remove(
                {"vendor_name":req.user.vendor},
                {justOne:false}
            );
            db.close();
        });

        User.getUserById(req.user._id,function (err,doc) {
            if(err){
                console.log("error!Not found!");
            }
            doc.vendor = vendor;
            doc.select_category = select_category;
            doc.market = market;
            doc.introduction = introduction;
            doc.image = imageName;
            doc.save();
        });




        res.redirect('/users/user_control_page');
    }
});


/********************Login********************************************/
router.get('/login', function(req, res, next) {
    res.render('users/login', { title: 'Express' });
});

//User Login
router.post('/login',
    passport.authenticate('local',{successRedirect:'/users/user_control_page',failureRedirect:'/users/login',failureFlash:true}),
    function(req,res) {
        res.redirect('/users/user_control_page');
});

router.get('/user_control_page',ensureAuthenticated ,function(req, res, next) {

    UserChartData.find({"User":req.user.username})
        .then(function (chartData) {
            UserActivityData.find({"vendor_name":req.user.vendor})
                .then(function (activityData) {
                    if(chartData==""){
                        if(activityData==""){
                            res.render('users/user_control_page',{user:req.user,chartData:null,activityData:null});
                        }else{
                            res.render('users/user_control_page',{user:req.user,chartData:null,activityData:activityData});
                        }
                    }else{
                        if(activityData==""){
                            res.render('users/user_control_page',{user:req.user,chartData:chartData,activityData:null});
                        }else{
                            res.render('users/user_control_page',{user:req.user,chartData:chartData,activityData:activityData});
                        }
                    }
                });
        });

});

//Passport Configuration
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username,function (err,user) {
            if(err) throw err;
            if(!user){
                return done(null,false,{message:'Unknown User'});
            }
            User.comparePassword(password,user.password,function (err,isMatch) {
                if(err) throw err;
                if(isMatch){
                    return done(null,user);
                }else{
                    return done(null,false,{message:'密碼錯誤!'});
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

/******************User Logout****************************************/
router.get('/logout',function (req,res) {
    req.logout();
    req.flash('success_msg','已成功登出');
    res.redirect('/users/login');
});


/******************User forgot password****************************************/

router.get('/forgot_password',function (req,res) {
    res.render('users/forgot_password', { title: 'forgot' });
});

router.post('/forgot_password',function (req,res) {
   let name = req.body.user_name;
   let email = req.body.email;
   let hint = req.body.hint;
   let answer = req.body.answer;

   console.log(req.body);

   req.flash('success_msg',"申請成功!請察看信箱");

   res.redirect('/users/login')
});



/*************Functions************************************************/
function ensureAuthenticated(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg','尚未登入狀態');
        res.redirect('/users/login');
    }
}

module.exports = router;
