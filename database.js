/**
 * Created by anshul on 16/7/17.
 */

var mongodb=require('mongodb');

var url='mongodb://anshul:anshul@ds121495.mlab.com:21495/myemoshare';

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

module.exports={
    connectDB,
    checkUser,
    registerUser
};
