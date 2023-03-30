const mongoose = require('mongoose');
const Teacher = require('../models/teacher');

module.exports = {
	show: (req,res,next)=>{
		Teacher.find()
			.select('_id name last_name school email')
			.populate('school','name')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					teachers: docs.map(doc => {
						return {
							_id: doc._id,
							name: doc.name,
							last_name: doc.last_name,
							school: doc.school,
							email: doc.email
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
		
		const teacher = new Teacher({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			last_name: req.body.last_name,
			school: req.body.school,
			email: req.body.email
		});
		teacher
			.save()
			.then(result=>{
				res.status(200).json({
					message: 'Created succesfully',
					createdTeacher: {
						_id: result._id,
						name: result.name,
						last_name: result.last_name,
						school: result.school,
						email: result.email
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
		const id = req.query.teacherId;
		Teacher.findById(id)
			.select('_id name last_name school email')
			.populate('school','name')
			.exec()
			.then(doc=> {
				if (doc) {
					res.status(200).json({
						teacher: doc
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
		const id = req.body.teacherId;
		const updateOps = req.body;
		delete updateOps._id
		Teacher.update({_id:id},{$set: updateOps})
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
		const id = req.body.teacherId;
		Teacher.remove({_id: id})
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
	teachersBySchool: (req, res, next)=>{
		Teacher.find({school:req.query.schoolId})
			.select('_id name last_name school email')
			.populate('school','name')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					teachers: docs.map(doc => {
						return {
							_id: doc._id,
							name: doc.name,
							last_name: doc.last_name,
							school: doc.school,
							email: doc.email,
							
							
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
	teachersBySchoolAndLastName: (req, res, next)=>{
		const string = req.body.string;
		Teacher.find({last_name: { $regex: string , $options:'i'} , school: req.userData.school } )
			.select('_id name last_name school email')
			.populate('school','name')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					teachers: docs.map(doc => {
						return {
							_id: doc._id,
							name: doc.name,
							last_name: doc.last_name,
							school: doc.school,
							email: doc.email,
							
							
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
	appTeacherInfo: (req,res,next)=>{
		
		Teacher.findOne({email: req.userData.email})
			.select('_id name last_name email school')
			.populate('school','name')
			.exec()
			.then( (doc) => {
				if (doc) {
					res.status(200).json({
						teacher: doc
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
	}
	
	
	
	
	
}