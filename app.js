const express = require('express');
const app = express();
require('./db');
const mongoose = require('mongoose');
const Item_sale = mongoose.model('Item_buy');
const Item_share = mongoose.model('Item_share');
const User = mongoose.model('User');
const session = require('express-session');
const auth = require('./auth.js');
const exphbs=require('express-handlebars');

var hbs = exphbs.create({
    helpers: {
        hello: function () { console.log('hello'); }
    }
});
app.engine('handlebars', hbs.engine);
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));

const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false 
};
app.use(session(sessionOptions));


app.get('/', function(req, res) {
    res.render('home');
});

app.get('/buy', function(req, res) {
	if (req.session.username === undefined) {
		res.render('home', {error: 'Please login or register first!'});
	}
	Item_sale.find({}, function(err, varToStoreResult) {
				if (err) {console.log(err);}
				const items = varToStoreResult;
				res.render('buy', {shop: items});
			});
});

app.post('/buy', function(req, res) {
	key = Object.keys(req.body)[0];
	Item_sale.findOneAndUpdate({_id: key}, {
		"$set": {"status": "requested"}}, 
			{upsert: true}, (err, doc) => {
				if (err) {
					console.log("Something wrong when updating data!");
				}
			});
});

app.get('/sell', function(req, res) {
	if (req.session.username === undefined) {
		res.render('home', {error: 'Please login or register first!'});
	}
    res.render('sell');
});
app.post('/sell', function(req, res) {
	if (typeof(req.body.title) !== 'string') {
		res.render('sell', {error: 'Name is not valid!'});
	}
	else if (typeof(req.body.price) !== 'string' || isNaN(req.body.price) || parseInt(req.body.price) < 0) {
		res.render('sell', {error: 'Price is ridiculous!'});
	}
	else {
				new Item_sale({
					title: req.body.title,
					price: parseInt(req.body.price),
					description: req.body.description,
					owner: req.session.username.username,
					status: 'posted',
					updated_at : Date.now()
				}).save(function(err, Item_sale, count){
					if (err) {console.log(err, count);}
					if (req.session.username !== undefined) {
						console.log('yes');
						User.findOneAndUpdate({username: req.session.username.username}, {
							"$push": {
								"items_buy": req.body.title}},
								{new: true}, (err, doc) => {
									if (err) {
										console.log("Something wrong when updating data!");
									}
								});
						}				
					res.redirect('/');
				});
			}
});

app.get('/share', function(req, res) {
	if (req.session.username === undefined) {
		res.render('home', {error: 'Please login or register first!'});
	}
	Item_sale.find({}, function(err, varToStoreResult) {
				if (err) {console.log(err);}
				const items = varToStoreResult;
				res.render('share', {shop: items});
			});
});

app.post('/share', function(req, res) {
	key = Object.keys(req.body)[0];
	Item_sale.findOneAndUpdate({_id: key}, {
		"$set": {"status": "requested"}}, 
			{upsert: true}, (err, doc) => {
				if (err) {
					console.log("Something wrong when updating data!");
				}
			});
});

app.get('/personal', function(req, res) {
	if (req.session.username === undefined) {
		res.render('home', {error: 'Please login or register first!'});
	}
	Item_sale.find({owner: req.session.username.username, status: "requested" }, function(err, varToStoreResult) {
				if (err) {console.log(err);}
				const items = varToStoreResult;
				res.render('personal', {shop: items});
			});
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
	function success(user) {
		auth.startAuthenticatedSession(req, user, (err = undefined) => {
			if (err) {
				console.log(err);
			}
			res.redirect('/');
		});
	}
	function error(obj) {
		res.render('register', {message: obj.message});
	}
	auth.register(req.body.username, req.body.email, req.body.password, error, success);
});


app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', (req, res) => {
	function success(user) {
		auth.startAuthenticatedSession(req, user, (err = undefined) => {
			if(err) {
				console.log(err);
			}
			res.redirect('/');
		});
	}
	function error(obj) {
		res.render('login', {message: obj.message});
	}
	auth.login(req.body.username, req.body.password, error, success);
	
});

app.listen(3000);