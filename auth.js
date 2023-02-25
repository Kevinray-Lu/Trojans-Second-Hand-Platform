// use bcrypt to hash passwords
const bcrypt = require('bcryptjs');
// Connect MongoDB
const mongoose = require('mongoose');
const User = mongoose.model('User');

// function to register new users
function register(username, email, password, errorCallback, successCallback) {
		// check if user already exists
		User.findOne({username: username},(err, result, count) => {
			if (result) {
				console.log('username exists!');
				errorCallback({message: 'USERNAME ALREADY EXISTS'});
			} else {
				// hash passwords to prevent leak
				bcrypt.hash(password, 10, function(err, hash) {
					// create new user
					new User({
						username: username,
						email: email,
						password: hash,
						actions: [],
					}).save(function(err, user, count){
						if (err) {
							console.log(count);
							console.log('document save error!');
							errorCallback({message: 'DOCUMENT SAVE ERROR'});
						} else {
							successCallback(user);
						}
					});
				});
			}
		});
}

// function to check login credentials
function login(username, password, errorCallback, successCallback) {
	User.findOne({username: username}, (err, user, count) => {
		if (!err && user) {
			// unhash passwords using bcrypt
			bcrypt.compare(password, user.password, (err, passwordMatch) => {
				if (passwordMatch) {
					successCallback(user);
				} else {
					console.log('passwords do not match!');
					errorCallback({message: 'PASSWORDS DO NOT MATCH'});
				}
			});
		} else {
			console.log(count);
			console.log('user not found!');
			errorCallback({message: 'USER NOT FOUND'});
		}
	});
}

// create session with user logged in
function startAuthenticatedSession(req, user, callback) {
	req.session.regenerate((err) => {
		if (!err) {
			req.session.username = user;
			callback();
		} else {
			callback(err);
		}
	});
}

module.exports = {
  startAuthenticatedSession: startAuthenticatedSession,
  register: register,
  login: login
};