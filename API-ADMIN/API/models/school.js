const mongoose = require('mongoose');

const schoolSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {type: String, required: true},
	logo: {type: String, required: true},
	kinder: {type:Boolean, default:true},
	primary: {type:Boolean, default:true},
	highschool: {type:Boolean, default:true}
});
module.exports = mongoose.model('School', schoolSchema,'schools');