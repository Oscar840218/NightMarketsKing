var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    username: {
        type:String,
        index:{unique:true}
    },
    password: {
        type:String
    },
    password_hint: {
        type:String
    },
    vendor: {
        type:String,
        index:{unique:true}
    },
    email: {
        type:String
    },
    image: {
        type:String
    },
    select_category: {
        type:String
    },
    market: {
        type:String
    },
    introduction: {
        type:String
    },
    address: {
        type:String
    },
    zip: {
        type:String
    },
    phone: {
        type:String
    },
    vendor_phone: {
      type:String
    },
    cellphone: {
        type:String
    },
    gender: {
        type:String
    },
    payment: {
        type:String
    },
    news: {
        type:String
    }
});

var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function (newUser,callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByUsername = function (username,callback) {
    var query = {username:username};
    User.findOne(query,callback)
};

module.exports.getUserById = function (id,callback) {
    User.findById(id,callback)
};



module.exports.comparePassword = function (candidatePassword,hash,callback) {
    bcrypt.compare(candidatePassword,hash,function (err,isMatch) {
        if(err) throw err;
        callback(null,isMatch);
    });
};
