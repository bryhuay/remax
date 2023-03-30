const mongoose = require('mongoose');
const Tutor = require('../models/tutor');

const Student = require('../models/student');

module.exports = {
	show: (req,res,next)=>{
		Tutor.find()
			.select('_id DNI name last_name address cellphone telephone email school')
			.populate('school','name')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					tutors: docs.map(doc => {
						return {
							_id: doc._id,
							DNI: doc.DNI,
							name: doc.name,
							last_name: doc.last_name,
							address: doc.address,
							cellphone: doc.cellphone,
							telephone: doc.telephone,
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
					error: err
				});
			});
	},
	create: (req,res,next)=>{
		
		const tutor = new Tutor({
			_id: new mongoose.Types.ObjectId(),
			DNI: req.body.DNI,
			name: req.body.name,
			last_name: req.body.last_name,
			address: req.body.address,
			cellphone: req.body.cellphone,
			telephone: req.body.telephone,
			email: req.body.email,
			school: req.body.school
		});
		tutor
			.save()
			.then(result=>{
				res.status(200).json({
					message: 'Created succesfully',
					createdTutor: {
						_id: result._id,
						DNI: result.DNI,
						name: result.name,
						last_name: result.last_name,
						address: result.address,
						cellphone: result.cellphone,
						telephone: result.telephone,
						email: result.email,
						school: result.school
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
		const id = req.query.tutorId;
		Tutor.findById(id)
			.select('_id DNI name last_name address cellphone telephone email school')
			.populate('school','name')
			.exec()
			.then(doc=> {
				if (doc) {
					res.status(200).json({
						tutor: doc
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
		const id = req.body.tutorId;
		const updateOps = req.body;
		delete updateOps._id
		Tutor.update({_id:id},{$set: updateOps})
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'Updated'
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
		const id = req.body.tutorId;
		Tutor.remove({_id: id})
			.exec()
			.then(result => {
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
	},
	searchByDNI: (req,res,next)=>{
		const string = req.body.string + '';
		Tutor.find({DNI: { $regex: string , $options:'i'}})
			.select('_id DNI name last_name address cellphone telephone email school')
			.populate('school','name')
			.exec()
			.then( (doc) => {
				if (doc) {
					res.status(200).json({
						tutor: doc
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
	tutorsBySchool: (req, res, next)=>{
		Tutor.find({school:req.query.schoolId})
			.select('_id DNI name last_name address cellphone telephone email school')
			.populate('school','name')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					tutors: docs.map(doc => {
						return {
							_id: doc._id,
							DNI: doc.DNI,
							name: doc.name,
							last_name: doc.last_name,
							address: doc.address,
							cellphone: doc.cellphone,
							telephone: doc.telephone,
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
					error: err
				});
			});
	},
	tutorsBySchoolAndLastName: (req, res, next)=>{
		const string = req.body.string;
		Tutor.find({last_name: { $regex: string , $options:'i'} , school: req.userData.school } )
		
			.select('_id DNI name last_name address cellphone telephone email school')
			.populate('school','name')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					tutors: docs.map(doc => {
						return {
							_id: doc._id,
							DNI: doc.DNI,
							name: doc.name,
							last_name: doc.last_name,
							address: doc.address,
							cellphone: doc.cellphone,
							telephone: doc.telephone,
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
					error: err
				});
			});
	},
	appHeaders: (req,res,next) => {
		Tutor.find({email: req.userData.email})
			.select('_id name last_name email school')
			.populate('school','_id name logo')
			.exec()
			.then( (doc) => {
				if (doc) {
					console.log(doc[0]._id);
					Student.find({tutor: doc[0]._id})
					.select('_id name last_name year')
					.exec()
					.then( (students) => {
						const list = students.map( (element) => {
							console.log(element.year.substr(1));
							return { key: element._id , fullName: element.name + " " + element.last_name, schedule: element.year.substr(1) }
						});

						res.status(200).json({
							tutor: {
								email: doc[0].email,
								fullName: doc[0].name + " " + doc[0].last_name
							},
							school: {
								_id: doc[0].school._id,
								name:doc[0].school.name,
								logo:doc[0].school.logo
							},
							students: list
						});
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({
							error: err
						});
					})

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
	appTutorInfo: (req,res,next)=>{
		
		Tutor.findOne({email: req.userData.email})
			.select('_id DNI name last_name address cellphone telephone email')
			.exec()
			.then( (doc) => {
				if (doc) {
					res.status(200).json({
						tutor: doc
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
}