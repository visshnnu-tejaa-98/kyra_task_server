const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { Post } = require('../models/post');
const { GENDER_ENUM, INTRESTS_ENUM } = require('../models/post');

const createPost = async (req, res) => {
	try {
		const post = await Post.findOne({ email: req.body.email });
		if (!post) {
			if (!GENDER_ENUM.includes(req.body.gender)) {
				res.status(400).json({ data: 'Gender must me MALE or FEMALE', status: false, error: null });
			}
			let gotIntrests = req.body.intrests;
			let result = gotIntrests.map((intrest) => INTRESTS_ENUM.includes(intrest));
			let resu = result.some((i) => i == false);
			console.log(resu);
			if (resu) {
				res.status(400).json({ data: 'Invalid intrests specified', status: false, error: null });
			}
			if (req.body.password == req.body.confirmPassword) {
				const salt = await bcrypt.genSalt(10);
				const hash = await bcrypt.hash(req.body.password, salt);
				req.body.password = hash;
				await Post.create({
					name: req.body.name,
					password: req.body.password,
					email: req.body.email,
					profileImg: req.body.profileImg,
					description: req.body.description,
					gender: req.body.gender,
					intrests: req.body.intrests,
				});
				const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, {
					expiresIn: '10h',
				});
				res.status(200).json({ data: 'Post Created', status: true, error: null, token });
			} else {
				res.status(400).json({ data: 'Password needs to be match', status: false, error: null });
			}
		} else {
			res
				.status(400)
				.json({ data: 'User Already Exist, Please Login', status: false, error: null });
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ data: 'Something went wrong', status: false, error: error.message });
	}
};

const getPosts = async (req, res) => {
	try {
		let posts = await Post.find();
		res.status(200).json({ data: posts, status: true, error: null });
	} catch (error) {
		console.log(error);
		res.status(400).json({ data: 'Something went wrong', status: false, error: error.message });
	}
};

const editPost = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			console.log('hello');
			res
				.status(404)
				.json({ data: `specified mongodb id is not valid`, status: true, error: null });
		}
		let post = await Post.findOne({ _id: id });
		if (post) {
			await Post.updateOne(
				{ _id: id },
				{
					name: req.body.name,
					password: req.body.password,
					email: req.body.email,
					profileImg: req.body.profileImg,
					description: req.body.description,
					gender: req.body.gender,
					intrests: req.body.intrests,
				}
			);
			res.status(200).json({ data: `Post updated with id : ${id}`, status: true, error: null });
		} else {
			res.status(404).json({ data: `No post found with id : ${id}`, status: true, error: null });
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ data: 'Something went wrong', status: false, error: error.message });
	}
};

const getPost = async (req, res) => {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			console.log('hello');
			res
				.status(404)
				.json({ data: `specified mongodb id is not valid`, status: true, error: null });
		}
		let post = await Post.findOne({ _id: id });
		if (post) {
			res.status(200).json({ data: post, status: true, error: null });
		} else {
			res.status(404).json({ data: `No post found with id : ${id}`, status: true, error: null });
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ data: 'Something went wrong', status: false, error: error.message });
	}
};

const deletePost = async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.params.id });
		if (post) {
			await Post.deleteOne({ _id: req.params.id });
			res.status(200).json({ data: 'Post Delete', status: true, error: null });
		} else {
			res.status(400).json({ data: 'Post doest not exist', status: false, error: null });
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ data: 'Something went wrong', status: false, error: error.message });
	}
};

const login = async (req, res) => {
	try {
		const post = await Post.findOne({ email: req.body.email });
		console.log(post.name);
		if (post) {
			let match = await bcrypt.compare(req.body.password, post.password);
			console.log(match);
			if (match) {
				const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, {
					expiresIn: '10h',
				});
				res.status(200).json({ data: 'User Allowed', status: true, error: null, token });
			} else {
				res.status(400).json({ data: 'Invalid email or password', status: false, error: null });
			}
		} else {
			res.status(400).json({ data: 'User doest not exist', status: false, error: null });
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ data: 'Something went wrong', status: false, error: error.message });
	}
};
module.exports = { createPost, getPosts, editPost, getPost, deletePost, login };
