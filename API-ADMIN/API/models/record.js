const mongoose = require('mongoose');
var types = 'CHECK_IN CHECK_OUT'.split(' ');

const recordSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	student: {type: mongoose.Schema.Types.ObjectId, ref:'Student', required: true},
	date: {type:Date, default: Date.now},
	school: {type: mongoose.Schema.Types.ObjectId, ref:'School', required: true},
	type: {type: String, enum: types, required: true}
});
module.exports = mongoose.model('Record', recordSchema,'records');