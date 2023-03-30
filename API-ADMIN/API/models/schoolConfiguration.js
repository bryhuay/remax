const mongoose = require('mongoose');

const schedule = mongoose.Schema({
	startHour: { type: String, minlength: 5, maxlength: 5, required: true }, 
	endHour: { type: String, minlength: 5, maxlength: 5, required: true },
	tolerance:  { type: Number, min: 5, max: 30, required: true }
});

const period = mongoose.Schema({
	start: { type:Date, required:true},
	end: { type:Date, required:true}
});

const schoolConfigurationSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	school: { type: mongoose.Schema.Types.ObjectId, ref:'School', required: true },
	year: { type:Number, required:true },
	startDate: { type:Date, required:true },
	endDate: { type:Date, required:true },
	kinderSchedule: { type: schedule },
	primarySchedule: { type: schedule },
	secondarySchedule: { type: schedule },
	vacations: { type:[period], required: true }
});

module.exports = mongoose.model('SchoolConfiguration', schoolConfigurationSchema,'schoolConfigurations');