const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('User');

function register(username, email, password, errorCallback, successCallback) {
		User.findOne({username: username},(err, result, count) => {
			if (result) {
				console.log('username exists!');
				errorCallback({message: 'USERNAME ALREADY EXISTS'});
			} else {
				bcrypt.hash(password, 10, function(err, hash) {
					new User({
						username: username,
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

function login(username, password, errorCallback, successCallback) {
	User.findOne({username: username}, (err, user, count) => {
		if (!err && user) {
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