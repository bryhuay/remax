const mongoose = require('mongoose');

const tutorSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	DNI: {type: String, required: true},
	name: {type: String, required: true},
	last_name: {type: String, required: true},
	address: {type: String, required: true},
	cellphone: {type: String, required: false},
	telephone: {type: String, required: true},
	email: {type: String, required: true},
	school: {type: mongoose.Schema.Types.ObjectId, ref:'School', required: true},
});
module.exports = mongoose.model('Tutor', tutorSchema,'tutors');