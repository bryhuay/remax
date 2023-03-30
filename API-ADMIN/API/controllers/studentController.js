const mongoose = require('mongoose');
const Student = require('../models/student');

module.exports = {
	show: (req,res,next)=>{
		Student.find()
			.select('_id name last_name gender DNI birthdate year section fingerprint code order_number school tutor teacher')
			.populate('school','name')
			.populate('tutor','name last_name cellphone DNI')
			.populate('teacher','name last_name')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					students: docs.map(doc => {
						return {
							_id: doc._id,
							name: doc.name,
							last_name: doc.last_name,
							gender: doc.gender,
							DNI: doc.DNI,
							birthdate: doc.birthdate,
							year: doc.year,
							section: doc.section,
							fingerprint: doc.fingerprint,
							code: doc.code,
							order_number: doc.order_number,
							school: doc.school,
							tutor: doc.tutor,
							teacher: doc.teacher
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
		
		const student = new Student({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			last_name: req.body.last_name,
			gender: req.body.gender,
			DNI: req.body.DNI,
			birthdate: req.body.birthdate,
			year: req.body.year,
			section: req.body.section,
			fingerprint: req.body.fingerprint,
			code: req.body.code,
			order_number: req.body.order_number,
			school: req.body.school,
			tutor: req.body.tutor,
			teacher: req.body.teacher
		});
		student
			.save()
			.then(result=>{
				res.status(200).json({
					message: 'Created succesfully',
					createdStudent: {
						_id: result._id,
						name: result.name,
						last_name: result.last_name,
						gender: result.gender,
						DNI: result.DNI,
						birthdate: result.birthdate,
						year: result.year,
						section: result.section,
						fingerprint: result.fingerprint,
						code: result.code,
						order_number: result.order_number,
						school: result.school,
						tutor: result.tutor,
						teacher: result.teacher
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
	studentByFingerAndSchool: (req, res, next)=>{
		Student.findOne({fingerprint:req.query.fingerId , school: req.userData.school})
			.select('_id name last_name')
			.exec()
			.then(doc => {
				if (doc) {
					res.status(200).json({
						student: doc
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
	studentsBySchoolAndYearAndSection: (req, res, next)=>{
		Student.find({school:req.userData.school, year:req.body.year, section:req.body.section})
			.select('_id DNI name last_name section tutor order_number teacher')
			.populate('tutor','DNI name last_name')
			.populate('teacher','name last_name')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					students: docs.map(doc => {
						return {
							_id: doc._id,
							name: doc.name,
							last_name: doc.last_name,
							DNI: doc.DNI,
							section: doc.section,
							order_number: doc.order_number,
							tutor: doc.tutor,
							teacher: doc.teacher
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
	find: (req,res,next)=>{
		const id = req.body.studentId;
		Student.findById(id)
			.select('_id name last_name gender DNI birthdate year section fingerprint code order_number school tutor teacher')
			.populate('school','name')
			.populate('tutor','name last_name DNI')
			.populate('teacher','name last_name')
			.exec()
			.then(doc=> {
				if (doc) {
					res.status(200).json({
						student: doc
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
		const id = req.body.studentId;
		const updateOps = req.body;
		delete updateOps._id
		Student.update({_id:id},{$set: updateOps})
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
		const id = req.body.studentId;
		Student.remove({_id: id})
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
	studentsBySchool: (req, res, next)=>{
		Student.find({school:(req.body.schoolId != null)?req.body.schoolId:req.query.schoolId})
			.select('_id DNI name last_name gender year section tutor teacher')
			.populate('tutor','DNI name last_name cellphone')
			.populate('teacher','name last_name')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					students: docs.map(doc => {
						return {
							_id: doc._id,
							name: doc.name,
							last_name: doc.last_name,
							gender: doc.gender,
							DNI: doc.DNI,
							year: doc.year,
							section: doc.section,
							tutor: doc.tutor,
							teacher: doc.teacher
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
	studentsByTutor: (req, res, next)=>{
		Student.find({tutor:req.query.tutorId})
			.select('_id DNI name last_name  year section ')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					students: docs.map(doc => {
						return {
							_id: doc._id,
							name: doc.name,
							last_name: doc.last_name,							
							DNI: doc.DNI,
							year: doc.year,
							section: doc.section
							
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
	studentsByTeacher: (req, res, next)=>{
		Student.find({teacher:req.query.teacherId})
			.select('_id DNI name last_name  birthdate order_number year section')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					students: docs.map(doc => {
						return {
							_id: doc._id,
							name: doc.name,
							last_name: doc.last_name,							
							DNI: doc.DNI,
							birthdate: doc.birthdate,
							order_number: doc.order_number,
							year: doc.year,
							section: doc.section
							
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
	studentsBySchoolAndYear: (req, res, next)=>{
		Student.find({school:req.body.school, year:req.body.year})
			.select('_id DNI name last_name section tutor order_number teacher')
			.populate('tutor','DNI name last_name')
			.populate('teacher','name last_name')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					students: docs.map(doc => {
						return {
							_id: doc._id,
							name: doc.name,
							last_name: doc.last_name,
							DNI: doc.DNI,
							section: doc.section,
							order_number: doc.order_number,
							tutor: doc.tutor,
							teacher: doc.teacher
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
	searchByName: (req, res, next)=>{
		const string = req.body.string;
		Student.find({name: { $regex: string , $options:'i'}})
			.select('_id name last_name gender DNI birthdate year section fingerprint code order_number school tutor teacher')
			.populate('school','name')
			.populate('tutor','DNI')
			.populate('teacher','name last_name')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					students: docs.map(doc => {
						return {
							_id: doc._id,
							name: doc.name,
							last_name: doc.last_name,
							gender: doc.gender,
							DNI: doc.DNI,
							birthdate: doc.birthdate,
							year: doc.year,
							section: doc.section,
							fingerprint: doc.fingerprint,
							code: doc.code,
							order_number: doc.order_number,
							school: doc.school,
							tutor: doc.tutor,
							teacher: doc.teacher
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
	searchByLastName: (req, res, next)=>{
		const string = req.body.string;
	
		Student.find({last_name: { $regex: string , $options:'i'} , school: req.userData.school } )
			.select('_id name last_name gender DNI birthdate year section fingerprint code order_number school tutor teacher')
			.populate('school','name')
			.populate('tutor','DNI')
			.populate('teacher','name last_name')
			.exec()
			.then(docs => {
				const response = {
					count: docs.length,
					students: docs.map(doc => {
						return {
							_id: doc._id,
							name: doc.name,
							last_name: doc.last_name,
							gender: doc.gender,
							DNI: doc.DNI,
							birthdate: doc.birthdate,
							year: doc.year,
							section: doc.section,
							fingerprint: doc.fingerprint,
							code: doc.code,
							order_number: doc.order_number,
							school: doc.school,
							tutor: doc.tutor,
							teacher: doc.teacher
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
	}
}