const mongoose = require('mongoose');
var genders = 'MALE FEMALE'.split(' ');
var years = '3I 4I 5I 1P 2P 3P 4P 5P 6P 1S 2S 3S 4S 5S'.split(' ');
var sections = 'A B C D E F G H UNIQUE'.split(' ');

const studentSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {type: String, required: true},
	last_name: {type: String, required: true},
	gender: {type: String, enum: genders, required: true},
	DNI: {type: String, required: true},
	birthdate: {type:Date, required: true},
	year: {type:String, enum: years, required: true},
	section: {type:String, enum: sections, required: true},
	fingerprint: {type:Number, required: true},
	code: {type:Number, required: true},
	order_number: {type:Number, required: true},
	school: {type: mongoose.Schema.Types.ObjectId, ref:'School', required: true},
	tutor: {type: mongoose.Schema.Types.ObjectId, ref:'Tutor', required: true},
	teacher: {type: mongoose.Schema.Types.ObjectId, ref:'Teacher', required: true}
});
module.exports = mongoose.model('Student', studentSchema,'students');