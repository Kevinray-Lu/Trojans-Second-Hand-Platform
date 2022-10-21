// import relevant packages
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
var fs = require('fs');
var path = require('path');


// use public folder and handlebars engine
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));

// initialize session to maintain login state
const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false 
};
app.use(session(sessionOptions));

// to support picture storage
var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });

// default home page
app.get('/', function(req, res) {
    res.render('home');
});

// item buying page
app.get('/buy', function(req, res) {
	// check login state
	if (req.session.username === undefined) {
		res.render('home', {error: 'Please login or register first!'});
	}
	// find all items ready for sale in database, tag finished will be omitted
	else {
	Item_sale.find({status: {$ne: "finished"}}, function(err, varToStoreResult) {
				if (err) {console.log(err);}
				let items = varToStoreResult;
				items = items.map((item) => { // start mapping images
					if (item.img.data !== undefined) {
					item.img.data = item.img.data.toString('base64'); // convert the data into base64
					item.img = item.img.toObject();
					}
					return item;
				});
				res.render('buy', {shop: items});
			});
	}
});

// this is a test block for next function
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

// create form for request botton of a product, this is to easily digest which user requested from session inputs for reference
app.post('/buy/:slug', function(req, res) {
	key = Object.keys(req.body)[0];
	Item_sale.findOneAndUpdate({_id: key}, {
		// update item information by adding new requests
		"$set": {"status": "requested"},
		"$push": {"requesters": req.session.username.email}}, 
			{upsert: true}, (err, doc) => {
				if (err) {
					console.log("Something wrong when updating data!");
				}
				else {
					// res.redirect("/buy");
					res.redirect("/personal");
				}
			});
});

// show item detail page
app.get('/buy/:slug', (req, res) => {
	// get item name to search in database
	let slug1 = req.path.split('/');
	slug1 = slug1[slug1.length -1];
	Item_sale.find({_id: slug1}, function (err, result) {
		if (err) {console.log(err);}
				let item = result[0];
				if (item.img.data !== undefined) {
					item.img.data = item.img.data.toString('base64'); // convert the data into base64
					item.img = item.img.toObject();
					}
				res.render('detail', {shop: item});
			});
});

// sell page for users to post new items
app.get('/sell', function(req, res) {
	if (req.session.username === undefined) {
		res.render('home', {error: 'Please login or register first!'});
	}
	else {
    res.render('sell');
	}
});

// create form for user to upload new item for sale, including a document(picture) of the item.
app.post('/sell', upload.single('image'), function(req, res, next) {
	// imput validations
	if (typeof(req.body.title) !== 'string') {
		res.render('sell', {error: 'Name is not valid!'});
	}
	else if (typeof(req.body.price) !== 'string' || isNaN(req.body.price) || parseInt(req.body.price) < 0) {
		res.render('sell', {error: 'Price is ridiculous!'});
	}
	// add new item to database
	else {
				new Item_sale({
					title: req.body.title,
					price: parseInt(req.body.price),
					description: req.body.description,
					owner: req.session.username.username,
					img: {data: fs.readFileSync('./uploads/' + req.file.filename),
					contentType: req.file.mimetype},
					status: 'posted',
					updated_at : Date.now()
				}).save(function(err, Item_sale, count){
					if (err) {console.log(err, count);}
					// update user information by adding new product in place
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

// page for user to lend products, similar to sell page for current development purposes
app.get('/lend', function(req, res) {
	if (req.session.username === undefined) {
		res.render('home', {error: 'Please login or register first!'});
	}else {
    res.render('lend');
	}
});

// form for user to post new lending products, similar to sell form
app.post('/lend', upload.single('image'), function(req, res) {
	if (typeof(req.body.title) !== 'string') {
		res.render('lend', {error: 'Name is not valid!'});
	}
	else if (typeof(req.body.price) !== 'string' || isNaN(req.body.price) || parseInt(req.body.price) < 0) {
		res.render('lend', {error: 'Price is ridiculous!'});
	}
	else {
				new Item_share({
					title: req.body.title,
					price: parseInt(req.body.price),
					description: req.body.description,
					owner: req.session.username.username,
					img: {data: fs.readFileSync('./uploads/' + req.file.filename),
					contentType: req.file.mimetype},
					status: 'posted',
					updated_at : Date.now()
				}).save(function(err, Item_sale, count){
					if (err) {console.log(err, count);}
					if (req.session.username !== undefined) {
						console.log('yes');
						User.findOneAndUpdate({username: req.session.username.username}, {
							"$push": {
								"items_share": req.body.title}},
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

// page for item sharing, similar to buying page for current development purposes
app.get('/share', function(req, res) {
	if (req.session.username === undefined) {
		res.render('home', {error: 'Please login or register first!'});
	}
	else {
	Item_share.find({status: {$ne: "finished"}}, function(err, varToStoreResult) {
				if (err) {console.log(err);}
				let items = varToStoreResult;
				items = items.map((item) => { // start mapping images
					if (item.img.data !== undefined) {
					item.img.data = item.img.data.toString('base64'); // convert the data into base64
					item.img = item.img.toObject();
					}
					return item;
				});
				res.render('share', {shop: items});
			});
	}
});

// create form for request sharing item button, similar to the form when buying item
app.post('/share/:slug', function(req, res) {
	key = Object.keys(req.body)[0];
	Item_share.findOneAndUpdate({_id: key}, {
		"$set": {"status": "requested"},
		"$push": {"requesters": req.session.username.email}}, 
			{upsert: true}, (err, doc) => {
				if (err) {
					console.log("Something wrong when updating data!");
				}
				else {
					// res.redirect("/buy");
					res.redirect("/personal");
				}
			});
});

// sharing item detail page, similar to buying page
app.get('/share/:slug', (req, res) => {
	let slug1 = req.path.split('/');
	slug1 = slug1[slug1.length -1];
	Item_share.find({_id: slug1}, function (err, result) {
		if (err) {console.log(err);}
				let item = result[0];
				if (item.img.data !== undefined) {
					item.img.data = item.img.data.toString('base64'); // convert the data into base64
					item.img = item.img.toObject();
					}
				res.render('detail', {shop: item});
			});
});

// personal history page
app.get('/personal', function(req, res) {
	if (req.session.username === undefined) {
		res.render('home', {error: 'Please login or register first!'});
	}
	// find all items user requested, and all other users that requested certain items of this user. will showcase two sections seperately.
	// buyers are able to see updates of requested items, but cannot contact sellers directly.
	// sellers are able to see requesters' emails and initiate contacts. They can also update items' availability by clicking denied (remove requesters) or finished (remove item since transaction is completed).
	else {
	Item_sale.find({owner: req.session.username.username, status: "requested" }, function(err, varToStoreResult) {
				if (err) {console.log(err);}
				const items = varToStoreResult;
				Item_sale.find({requesters: req.session.username.email, status: "requested" }, function(err, varToStoreResult) {
					if (err) {console.log(err);}
					const request = varToStoreResult;
					Item_share.find({requesters: req.session.username.email, status: "requested" }, function(err, varToStoreResult) {
						if (err) {console.log(err);}
						const request2 = varToStoreResult;
						Item_share.find({owner: req.session.username.username, status: "requested" }, function(err, varToStoreResult) {
							if (err) {console.log(err);}
							const items2 = varToStoreResult;
							res.render('personal', {shop: items, request: request, shop2: items2, request2: request2});
						});
					});
				});
			});
	}
});

// form to update items' availability
app.post('/personal', function(req, res) {
	// change to finished status and hide item from display. (item still in database)
	if (Object.values(req.body)[0] === "Finished") {
		 result = 'finished';
		 key = Object.keys(req.body)[0];
		 Item_sale.findOneAndUpdate({_id: key}, {
		"$set": {"status": result, "requesters": []}}, 
			{upsert: true}, (err, doc) => {
				if (err) {
					console.log("Something wrong when updating data!");
				}
				else {
					console.log(doc);
					if (doc !== null && doc.owner === []) {
						res.redirect("/personal");
					} else {
						Item_share.findOneAndUpdate({_id: key}, {
							"$set": {"status": result, "requesters": []}}, 
								{upsert: true}, (err, doc) => {
									if (err) {
										console.log("Something wrong when updating data!");
									}
									else {
										res.redirect("/personal");
									}
								});
					}
				}
			});
	} else {
		// remove all requesters from list, transaction is denied and item is reposted for requests
		 result = 'posted';
		 key = Object.keys(req.body)[0];
		 Item_sale.findOneAndUpdate({_id: key}, {
		"$set": {"status": result, "requesters": []}}, 
			{upsert: true}, (err, doc) => {
				if (err) {
					console.log("Something wrong when updating data!");
				}
				else {
					if (doc !== null && doc.owner === []) {
						res.redirect("/personal");
					} else {
						Item_share.findOneAndUpdate({_id: key}, {
							"$set": {"status": result, "requesters": []}}, 
								{upsert: true}, (err, doc) => {
									if (err) {
										console.log("Something wrong when updating data!");
									}
									else {
										res.redirect("/personal");
									}
								});
					}
				}
			});
	}
	
});

// register page for user 
app.get('/register', (req, res) => {
	res.render('register');
});

// take input from user to register new account
app.post('/register', (req, res) => {
	function success(user) {
		// start new session with registered user
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
	// use functions in auth.js to register new user
	auth.register(req.body.username, req.body.email, req.body.password, error, success);
});

// login page for users
app.get('/login', (req, res) => {
	res.render('login');
});

// validation of login credentials
app.post('/login', (req, res) => {
	function success(user) {
		// start user session with login credentials
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
	// use functions in auth.js to check login credentials
	auth.login(req.body.username, req.body.password, error, success);
	
});

// deploy on public website or locally
app.listen(process.env.PORT || 3000);