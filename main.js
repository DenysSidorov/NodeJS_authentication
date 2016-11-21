var express = require('express');
var app = express();

// parses request cookies to req.cookies
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// use req.session as data store
var session = require('cookie-session');
app.use(session({keys: ['secret']}));

var bodyParser = require('body-parser');
app.use(bodyParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// parse application/json
app.use(bodyParser.json());

// add stic files
app.use(express.static(__dirname + '/views'));

var templating = require('consolidate');
app.engine('jade', templating.jade);
app.set('view engine', 'jade');

app.set('views', __dirname + '/views'); // + '/views'

// authentication middleware
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());


var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({
    usernameField: 'mail',
    passwordField: 'pass'
}, function(username, password,done){
    if (username != 'admin')
        return done(null, false, {message: 'Неверный логин'});
    if (password != 'admin')
        return done(null, false, {message: 'Неверный пароль'});
    return done(null, {username: 'admin'});
}));


var auth = passport.authenticate(
    'local', {
        successRedirect: '/users',
        failureRedirect: '/login'
    }
);

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    done(null, {username: id});
});

var mustBeAuthenticated = function (req, res, next) {
    req.isAuthenticated() ? next() : res.redirect('/login');
};

app.get('/', auth);
app.post('/login', auth);
app.get('/login',function (req, resp) {
    resp.render('login');
});

app.all('/users', mustBeAuthenticated);
app.all('/user/*', mustBeAuthenticated);
app.get('/test',function (req, resp) {
   console.log('test');
    if(req.isAuthenticated()){
        resp.send('ok');
    }else {
        res.redirect('/login');
    }
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

app.get('/users', function (req, res) {
 var result = [
     {id:1,name:'denasd', age:87, married:0},
     {id:2,name:'deasdn', age:56, married:2},
     {id:3,name:'deasn', age:56, married:3},
     {id:4,name:'deasdn', age:34, married:4}
 ] ;
        res.render('index', {
            title: 'List Users',
            users: result
        });
});

app.get('/user/:id',function (req, resp) {
   resp.send('User number: ' +req.params.id);
});

app.listen(8080);
console.log('Express server listening on port 8080');
