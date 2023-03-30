const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const defaultPicture = 'profilePictures\\default.jpeg';
const User = require('../models/user');
const jwt = require('jsonwebtoken');

var nodemailer = require('nodemailer');

module.exports = {
	show: (req,res,next)=>{
		User.find()
			.select('_id email password type school')
			.populate('school','name')
			.exec()
			.then(docs =>{
				const response = {
					count: docs.length,
					users: docs.map(doc=>{
						return{
							_id: doc._id,
							email: doc.email,
							password: doc.password,
							type: doc.type,
							school: doc.school
						}
					})
				};
				res.status(200).json(response);
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error:err
				});
			});		
	},
	create: (req,res,next)=>{
		User.find({email: req.body.email})
		.exec()
		.then(user => {
			if (user.length >= 1) {
				return res.status(409).json({
					message: 'Mail exists'
				});
			}else{
				bcrypt.hash(req.body.password, 10, (err,hash)=>{
					if (err) {
						return res.status(500).json({
							error:err
						});
					}else{
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash,
							type: req.body.type,
							school: req.body.school
						});
						user 
							.save()
							.then(result => {
								
								res.status(201).json({
									message: 'Succesfully created',
									createdUser: {
										_id: result._id,
										email: result.email,
										password: result.password,
										type: result.type,
										school: result.school
									}
								});
							})
							.catch(err => {
								console.log(err);
								res.status(500).json({
									error:err
								});
							});	
					}
				})
			}
		})
	},
	find: (req,res,next)=>{
		const id = req.userData.userId;
		User.findById(id)
			.select('_id email type school')
			.populate('school','name')
			.exec()
			.then(doc => {
				if (doc) {
					res.status(200).json({
						user: doc,
					});
				}else{
					res.status(404).json({message:'No valid entry found for provided ID'});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			})
	},
	update: (req,res,next)=>{
		const id = req.body.userId;
		const obj = req.body;
		delete obj.userId;
		delete obj.password;
		
		User.update({_id: id},{$set: obj})
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'User updated'
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error:err
				});
			});
	},
	delete: (req,res,next)=>{
		if(req.userData.type == "ADMIN" || req.userData.type == "DIRECTOR"){
		const id = req.query.userId;
		User.findById(id)
			.select('_id')
			.exec()
			.then(doc =>{
				if (!doc) {
					return res.status(404).json({
						message: "User not found"
					});
				}else{
					User.remove({_id: id})
						.exec()
						.then(result => {
							res.status(200).json({
								message: 'User deleted',
							});
						})
						.catch(err => {
							console.log(err);
							res.status(500).json({
								error: err
							});
						});			
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
		}
		else{
			res.status(401).json({
				message: "Dont have permissions"
			});
		}
	},
	password: (req,res,next)=>{
		const email = req.body.email;
		
		User.find({email: email})
			.exec()
			.then(user => {
				if (user.length < 1) {
					return res.status(409).json({
						message: 'Email does not exist'
					});
				}else{

					/* send email */
					const password = String.fromCharCode(
											Math.floor(Math.random() * (91 - 65)) + 65,
											Math.floor(Math.random() * (123 - 97)) + 97,
											Math.floor(Math.random() * (58 - 48)) + 48,
										) + "@" 
										+ String.fromCharCode(
											Math.floor(Math.random() * (91 - 65)) + 65,
											Math.floor(Math.random() * (123 - 97)) + 97,
											Math.floor(Math.random() * (58 - 48)) + 48,
											Math.floor(Math.random() * (123 - 97)) + 97,
											Math.floor(Math.random() * (123 - 97)) + 97,
											Math.floor(Math.random() * (123 - 97)) + 97,
											Math.floor(Math.random() * (123 - 97)) + 97,
											Math.floor(Math.random() * (58 - 48)) + 48,
										);


					var transporter = nodemailer.createTransport({
					  service: 'gmail',
					  auth: {
					    user: 'test@gmail.com',
					    pass: 'contraseña'
					  }
					});

					var mailOptions = {
					  from: 'test@gmail.com',
					  to: email,
					  subject: 'Contraseña de la cuenta.',
					  text: 'Su contraseña es ' + password
					};

					transporter.sendMail(mailOptions, function(error, info){
					  if (error) {
					    console.log(error);
					  } else {
					    console.log('Email sent: ' + info.response);
					  }
					});
					
					bcrypt.hash(password, 10, (err,hash)=>{
						if (err) throw err;
						User.update({email: email},{$set: {password: hash}})
							.exec();
							console.log('Contraseña actualizada');
					});

					/* send email */

				}
				res.status(201).json({
					message: 'Password Updated'
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
	},
	login: (req,res,next)=>{
		User.find({ email: req.body.email})
		.exec()
		.then(user => {
			if (user.length < 1) {
				return res.status(401).json({
					message: 'Auth failed'
				});
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: 'Auth failed'
					});
				}
				if (result) {
					const token = jwt.sign(
					{
						email: user[0].email,
						userId: user[0]._id,
						type: user[0].type,
						school: (user[0].school != null)?user[0].school:''
					},
					//process.env.JWT_KEY,
					'secret',
					{
						expiresIn: "2h"
					}
					);
					return res.status(200).json({
						message: 'Auth succesful',
						token: token,
						headers: req.headers
					});
				}
				res.status(401).json({
					message: 'Auth failed'
				});
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	},
	edit:(req,res,next)=>{
		User.findById(req.body.userId)
			.select('_id email type school')
			.populate('school','name')
			.exec()
			.then(doc => {
				if (doc) {
					res.status(200).json({
						usuario: doc
					});
				}else{
					res.status(404).json({message: 'No valid entry found for provided ID'});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			});
	},
	headers:(req,res,next)=>{
		User.findById(req.userData.userId)
			.select('_id email type school')
			.populate('school','name logo')
			.exec()
			.then(doc => {
				if (doc) {
					res.status(200).json({
						usuario: doc
					});
				}else{
					res.status(404).json({message: 'No valid entry found for provided ID'});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			});	
	},
	getUserById:(req,res,next)=>{
		User.findById(req.query.userId)
			.select('_id email type school')
			.populate('school','name')
			.exec()
			.then(doc => {
				if (doc) {
					res.status(200).json({
						usuario: doc
					});
				}else{
					res.status(404).json({message: 'No valid entry found for provided ID'});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			});
	},
	search:(req,res,next)=>{
		const string = req.body.string;
		User.find({email:{ $regex: string , $options:'i'}})
			.select('_id email type school')
			.populate('school','name')
			.exec()
			.then(docs => {
				if (docs.length == []) {
					res.status(404).json({message:'No entries found'})
				}
				res.status(200).json({
					count: docs.length,
					result: docs.map(doc => {
						return {
							_id: doc._id,
							email: doc.email,
							type: doc.type,
							school: doc.school
						}
					})
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error:err});
			});
	},
	usersByType:(req,res,next)=>{
		User.find({type: (req.body.type != null)?req.body.type:req.query.type})
			.select('_id email school')
			.populate('school','name')
			.exec()
			.then(docs =>{
				const response = {
					count: docs.length,
					users: docs.map(doc=>{
						return{
							_id: doc._id,
							email: doc.email,
							school: doc.school
						}
					})
				};
				res.status(200).json(response);
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error:err
				});
			});		
	},
	usersBySchool:(req,res,next)=>{
		//User.find({school: (req.userData.school != null)?req.body.school:req.query.school})
		const school = req.query.schoolId;
		User.find({school: school })

			.select('_id email type')
			.populate('school','name')
			.exec()
			.then(docs =>{
				const response = {
					count: docs.length,
					users: docs.map(doc=>{
						return{
							_id: doc._id,
							email: doc.email,
							type: doc.type
						}
					})
				};
				res.status(200).json(response);
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error:err
				});
			});		
	},
	usersByTypeAndSchool:()=>{
		User.find(
				{
					type: req.body.type, 
					school: req.body.school
				}
			)
			.select('_id email password')
			.populate('school','name')
			.exec()
			.then(docs =>{
				const response = {
					count: docs.length,
					users: docs.map(doc=>{
						return{
							_id: doc._id,
							email: doc.email
						}
					})
				};
				res.status(200).json(response);
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error:err
				});
			});		
	}
}