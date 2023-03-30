const mongoose = require('mongoose');
var types = 'ADMIN DIRECTOR TUTOR DOORMAN TEACHER'.split(' ');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {type: String, required: true},
	password: {type: String, required: true},
	type: {type: String, enum: types, required: true},
	school: {type: mongoose.Schema.Types.ObjectId, ref:'School', required: false}
});

module.exports = mongoose.model('User', userSchema,'users');

