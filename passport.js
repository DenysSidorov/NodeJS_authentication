var express = require('express');
var app = express();

// parses request cookies to req.cookies
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// parses json, x-www-form-urlencoded, and multipart/form-data
var bodyParser = require('body-parser');
app.use(bodyParser());

// use req.session as data store
var session = require('cookie-session');
app.use(session({keys: ['secret']}));

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


passport.serializeUser(function(user, done) {
	done(null, user.username);
});

passport.deserializeUser(function(id, done) {
	done(null, {username: id});
});


var auth = passport.authenticate(
	'local', {
		successRedirect: '/user', 
		failureRedirect: '/login'
	}
);

app.get('/login', function(req, res) {
	res.send(200, 'TODO: Login form');
});

app.get('/', auth);

app.post('/login', auth);

var mustBeAuthenticated = function (req, res, next) {
	req.isAuthenticated() ? next() : res.redirect('/user');
};

app.all('/user', mustBeAuthenticated);
app.all('/user/*', mustBeAuthenticated);

app.get('/user', function(req, res) {
	res.send(200, 'Hello, ' + req.user.username);
});

app.get('/user/settings', function(req, res) {
	res.send(200, 'Secret place');
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.listen(8080);
console.log('Express started on port %d', 8080);
