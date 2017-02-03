/**
 * Created by Oscar on 2017/1/10.
 */
var mongo = require('mongodb').MongoClient;


function insert(item, collection, callback) {
    mongo.connect(url,function (err,db) {
        if(err) {
            console.log(err);
        }
        //assert.equal(null,err);
        db.collection(collection).insertOne(item,function (err,result) {
            assert.equal(null,err);
            console.log('item inserted');
            db.close();
        }, function() {
            if(callback !== undefined) {
                callback();
            }
        });
    });
}



module.exports = {
    insert: insert

}