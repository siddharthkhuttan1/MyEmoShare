/**
 * Created by anshul on 19/7/17.
 */

var express=require('express');
var passport=require('passport');
var passportLocal=require('passport-local');
var cp=require('cookie-parser');
var bp=require('body-parser');
var session=require('express-session');
var database=require('./database.js');
var port=4000||process.env.port;

var app=express();
var localStrategy=passportLocal.Strategy;

app.use(cp());
app.use('/login',express.static('subfiles/login'));
app.use('/signup',express.static('subfiles/signup'));
app.use('/write',express.static('subfiles/write'));
app.use('/read',express.static('subfiles/read'));
app.use('/',express.static('subfiles/landing'));
app.use(bp.json());
app.use(bp.urlencoded({ extended:true }));
app.use(session({secret:'keyboard cat'}));

app.use(passport.initialize());
app.use(passport.session());


var route={
    secure:require('./route/secure.js'),
    notsecure:require('./route/notsecure.js')
}

app.use('/secure',route.secure);
app.use('/notsecure',route.notsecure);
//passport code
passport.use(new localStrategy(
    function(username, password, done) {

        database.checkUser(username,password,function(data){

            for(var i=0;i<data.length;i++){
                if(data[i].username===username&&data[i].password===password) {
                    return done(null, username);
                }
                else if(data[i].username===username&&data[i].password!==password) {
                    return done(null,false,{message:"Please enter correct password"})
                }
            }
            return done(null,false,{message:"Please enter correct username"});
        });

    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

app.post('/login',passport.authenticate('local',{successRedirect:'/read',failureRedirect: '/'}));

app.post('/signup',function(req,res,err){
        database.registerUser(req.body.username,req.body.password,function(data){
                res.redirect("./login");
        });
})

app.post('/write',function(req,res){
    var obj={"username":req.user,"story":req.body.writeup,"target":req.body.target};
    database.addStory(JSON.stringify(obj),function(data){
        console.log(data);
    })

})

app.post('/read',function(req,res){

    database.displayStory(req.body.genre,function(data){
        res.send(data);
    })

})
app.post('/thank',function(req,res){

    var obj={
        "id":req.body.id,
        "user":req.user,
        "genre":req.body.genre

    };
    database.thankUser(obj);

})


database.connectDB(function(){
    app.listen(port,function(){
        console.log("Server is running at port "+port);
    })
})


