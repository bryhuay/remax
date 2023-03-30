const mongoose = require('mongoose');
const SchoolConf = require('../models/schoolConfiguration');

module.exports = {
	show: (req,res,next)=>{
		SchoolConf.find()
			.select('_id school year startDate endDate')
			.exec()
			.then(docs => {
				res.status(200).json({
					count: docs.length,
					orders: docs.map(doc => {
						return {
							_id: doc._id,
							school: doc.school,
							year: doc.year,
							startDate: doc.startDate,
							endDate: doc.endDate,
							vacations: doc.vacations
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
		const vacations = [];
		for (const doc of req.body.vacations){
			vacations.push( doc );
		}

		const schoolConf = new SchoolConf({
			_id: new mongoose.Types.ObjectId(),
			school: req.body.school,
			year: req.body.year,
			startDate: req.body.startDate,
			endDate: req.body.endDate,
			kinderSchedule: req.body.kinderSchedule,
			primarySchedule: req.body.primarySchedule,
			secondarySchedule: req.body.secondarySchedule,
			vacations: vacations
		});

		schoolConf
			.save()
			.then(result=>{
				console.log(result);
				res.status(201).json({
					message: 'Created succesfully',
					createdSchool: {
						_id: result._id,
						school: result.school,
						year: result.year,
						startDate: result.startDate,
						endDate: result.endDate,
						kinderSchedule: result.kinderSchedule,
						primarySchedule: result.primarySchedule,
						secondarySchedule: result.secondarySchedule,
						vacations: result.vacations
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
		const schoolId = req.query.schoolId;
		SchoolConf.findOne({school: schoolId})
			.select('_id school year startDate endDate kinderSchedule primarySchedule secondarySchedule vacations')
			.populate('school','_id name')
			.exec()
			.then(doc => {
				if (doc) {
					res.status(200).json({
						schoolConf: doc
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

		SchoolConf.update({_id:id},{$set: obj })
			.exec()
			.then(result => {
				res.status(200).json({
					message: 'configuration updated'
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
		const id = req.body.schoolConfId;
		SchoolConf.remove({_id: id})
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
	},
	edit:(req,res,next)=>{
		SchoolConf.findById(req.body.schoolConfId)
			.select('_id school year startDate endDate kinderSchedule primarySchedule secondarySchedule vacations')
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
	appSchoolConfig:(req,res,next)=>{
		SchoolConf.findOne({school: req.body.schoolId})
			.select('startDate endDate kinderSchedule primarySchedule secondarySchedule vacations')
			.exec()
			.then((doc) =>  {
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
	}
}