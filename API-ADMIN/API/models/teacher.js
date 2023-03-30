const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {type: String, required: true},
	last_name: {type: String, required: true},
	school: {type: mongoose.Schema.Types.ObjectId, ref:'School', required: true},
	email: {type: String, required: true},
	});
module.exports = mongoose.model('Teacher', teacherSchema,'teachers');