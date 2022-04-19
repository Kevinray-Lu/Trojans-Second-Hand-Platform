const mongoose = require('mongoose');
//Item object for sale
const Item_buy = new mongoose.Schema({
	title: String,
	price: Number,
	description: String,
	status: String, 
	owner: [{ type: String, ref: 'User.username' }],
	requesters: [{ type: String, ref: 'User.email' }],
});

const Item_share = new mongoose.Schema({
	title: String,
	price: Number,
	description: String,
	status: String, 
	owner: [{ type: String, ref: 'User.username' }],
	requesters: [{ type: String, ref: 'User.email' }],
});

const User = new mongoose.Schema({
	username: String,
	email: String,
	password: {type: String, unique: true, required: true},
	items_buy: [{ type: String, ref: 'Item_buy.title' }],
	items_share: [{ type: String, ref: 'Item_share.title' }],
});

mongoose.model('Item_buy', Item_buy);
mongoose.model('Item_share', Item_share);
mongoose.model('User', User);

// // is the environment variable, NODE_ENV, set to PRODUCTION? 
// let dbconf;
// if (process.env.NODE_ENV === 'PRODUCTION') {
//  // if we're in PRODUCTION mode, then read the configration from a file
//  // use blocking file io to do this...
//  const fs = require('fs');
//  const path = require('path');
//  const fn = path.join(__dirname, 'config.json');
//  const data = fs.readFileSync(fn);
//  // our configuration file will be in json, so parse it and set the
//  // conenction string appropriately!
//  const conf = JSON.parse(data);
//  console.log(conf.dbconf);
//  dbconf = conf.dbconf;
// } else {
//  // if we're not in PRODUCTION mode, then use
//  dbconf = 'mongodb://localhost/final';
// }

// Using local database
// mongoose.connect('mongodb://localhost/final')
// Using cloud database
mongoose.connect('mongodb+srv://Trojan551:dbTrojan551@551trojan.t6rzu.mongodb.net/final?retryWrites=true&w=majority');