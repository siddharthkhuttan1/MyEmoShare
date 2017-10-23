/**
 * Created by anshul on 16/7/17.
 */

var mongodb=require('mongodb');

var url='mongodb://anshul:anshul@ds121495.mlab.com:21495/myemoshare';
var ObjectId = require('mongodb').ObjectID;

var obj='';

function connectDB(run_server) {
    mongodb.MongoClient.connect(url, function (err, db) {
        if (err)throw err;
        console.log('Connection is established');
        obj=db;
        run_server();
    })
}

function checkUser( username , password , cb ){
        obj.collection('Users').find().toArray(function(err,data){
            if(err)throw err;
            cb(data);
        });

}

function registerUser( username , password , cb ){
    obj.collection('Users').insertOne({"username":
        username,"password": password},function(err,data){
        if(err)throw err;
        cb(data);
    });
}

function addStory(string, cb){
    var story=JSON.parse(string);
    obj.collection('Stories.'+story.target).insertOne({"username":
    story.username,"story": story.story},function(err,data){
        if(err)throw err;
        cb(data);
    });
}
function displayStory(genre, cb){

    obj.collection('Stories.'+genre).find().toArray(function(err,data){
        if(err)throw err;
        cb(data);
    });
}

function thankUser(object) {

    obj.collection('Stories.' + object.genre).find({"_id": ObjectId(object.id)}, {thanks: 1}).toArray(function (err, data) {
        if (err) throw err;
        var arr = data[0].thanks;
        arr.push(object.user);
        obj.collection('Stories.' + object.genre).update({"_id": ObjectId(object.id)}, {$set: {"thanks": arr}});
    })
}

module.exports={
    connectDB,
    checkUser,
    registerUser,
    addStory,
    displayStory,
    thankUser
};
