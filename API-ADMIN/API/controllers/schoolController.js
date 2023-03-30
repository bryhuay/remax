const mongoose = require('mongoose');
const School = require('../models/school');
const fs = require('fs');
const defaultPicture = 'Uploads\\default.jpeg';
const cron = require('node-cron');

module.exports = {
	show: (req,res,next)=>{
		School.find()
			.select('_id name logo kinder primary highschool')
			.exec()
			.then(docs => {
				res.status(200).json({
					count: docs.length,
					orders: docs.map(doc => {
						return {
							_id: doc._id,
							name: doc.name,
							logo: doc.logo,
							kinder: doc.kinder,
							primary: doc.primary,
							highschool: doc.highschool,
						}
					})
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				})
			});
	},
	create: (req,res,next)=>{
		
		const logo = req.file === undefined ? defaultPicture : req.file.path;

		const school = new School({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			logo: logo,
			kinder: req.body.kinder,
			primary: req.body.primary,
			highschool: req.body.highschool
		});

		school
			.save()		
			.then(result=>{
				console.log(result);
				res.status(201).json({
					message: 'Created succesfully',
					createdSchool: {
						_id: result._id,
						name: result.name,
						logo: result.logo,
						kinder: result.kinder,
						primary: result.primary,
						highschool: result.highschool
					}
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
	},
	find: (req,res,next)=>{
		const id = req.query.schoolId;
		School.findById(id)
			.select('_id name logo kinder primary highschool')
			.exec()
			.then(doc => {
				if (doc) {
					res.status(200).json({
						school: doc
					});
				}else{
					res.status(404).json({message: 'No valid entry found for provided ID'});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
	},
	update: (req,res,next)=>{
		const id = req.body._id;
		const obj = req.body;
		delete obj._id;

		const logo = req.file === undefined ? defaultPicture : req.file.path;
		if (req.file != null) {
			School.findById(id)
			.select('logo')
			.exec()
			.then(doc=>{
				if (doc.logo != null) {
				
					fs.unlink(doc.logo , (err) => {
						if (err) {
							if (err.code === 'ENOENT'){
								School.update({_id:id},{$set: {logo:[]}})
								.exec();
							}
						}else{
							console.log(doc.logo+' was deleted');
						}
					});
				
				}
				const logo = req.file.path;

				School.update({_id: id},{$set:{logo:logo}})
				.exec();
			})
			.catch(err=>{throw err});
		}
		delete obj.logo;
		School.update({_id:id},{$set: obj })
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'Ad updated'
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				});
			});
	},
	delete: (req,res,next)=>{
		const id = req.body.schoolId;
		School.findById(id)
			.select('logo')
			.exec()
			.then(doc=>{
				if (!doc) {
					return res.status(404).json({
						message: "Not found"
					});
				}else{
					if (doc.logo != null) {
						fs.unlink(doc.logo , (err) => {
						  if (err) throw err;
						  console.log(doc.logo + ' was deleted');
						});
					}
					School.remove({_id: id})
					.exec()
					.then(result=> {
						res.status(200).json({
							message: 'Deleted'
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
	},
	edit:(req,res,next)=>{
		School.findById(req.body.schoolId)
			.select('_id name logo kinder primary highschool')
			.exec()
			.then(doc => {
				if (doc) {
					res.status(200).json({
						school: doc
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
	listById:(req,res,next)=>{
		const id = req.query.school;
		School.find({name: id})
			.select('_id name logo kinder primary highschool')
			.exec()
			.then(doc=>{
				if (doc.length < 1) {
					res.status(401).json({
						message: 'Does not exist'
					});
				}else{
					res.status(200).json({
						result:doc
					});	
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error:err});
			});
	},
	search:(req,res,next) => {
		const string = req.body.string;
		School.find({name: { $regex: string , $options:'i'}})
		.sort({destacado:-1})
			.select('_id name logo kinder primary highschool')
			.exec()
			.then(docs => {
				res.status(200).json({
					count: docs.length,
					result: docs.map(doc => {
						return {
							_id: doc._id,
							name: doc.name,
							logo: doc.logo,
							kinder: doc.kinder,
							primary: doc.primary,
							highschool: doc.highschool
						}
					})
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error:err});
			});
	},
	img:(req,res,next) =>{
		School.findById(req.query.schoolId)
			.select('logo')
			.exec()
			.then(doc => {
				if (doc) {
					const url = 'http://localhost:3000/'+doc.logo;

					res.status(200).json({
						logo: url
					});
				}else{
					res.status(404).json({message: 'No valid entry found for provided ID'});
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({error: err});
			});
	}
}