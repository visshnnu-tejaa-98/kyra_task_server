const mongoose = require('mongoose');

const GENDER_ENUM = ['male', 'female'];
const INTRESTS_ENUM = ['sports', 'technology', 'news', 'music', 'movies'];

const post = mongoose.Schema({
	name: {
		type: String,
		requried: true,
	},
	password: {
		type: String,
		requried: true,
	},
	confirmPassword: {
		type: String,
	},
	email: {
		type: String,
		required: true,
	},
	profileImg: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		enum: GENDER_ENUM,
		required: true,
	},
	intrests: {
		type: [String],
		enum: INTRESTS_ENUM,
		required: true,
	},
});

const Post = mongoose.model('post', post);
module.exports = { Post, GENDER_ENUM, INTRESTS_ENUM };
