const mongoose = require('mongoose');
const validator = require("validator");

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		validate: [validator.isEmail, 'Please provide a valid email address']
	},
	password: {
		type: String,
		required: true,
		minLength: [8, 'Password must be at least 8 characters long'],
		maxLength: [128, 'Password must be less than 128 characters long'],
		validate: {
			validator: function(value){
        		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/;
				return regex.test(value);
			},
			message: 'Password must contain at least one uppercase letter, one lowercase letter, one special character and one number'
		}
	}
});

module.exports = mongoose.model('User', userSchema);
