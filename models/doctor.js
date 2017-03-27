var mongoose = require('mongoose');

var doctorSchema = new mongoose.Schema({
	userId: String, 
	name: String, 
	birthday: Date, 
	gender: Number, 
	IDNo: String, 
	workUnit: String, 
	title: String, 
	department: String, 
	major: String, 
	introduction: String, 
	score: Number, 
	charge1: Number, 
	charge2: Number, 
	teams: [String], 
	revisionInfo:{
		operationTime:Date,
		userId:String,
		userName:String,
		terminalIP:String
	}
});


var doctorModel = mongoose.model('doctor', doctorSchema);

function Doctor(doctor) {
	this.doctor = doctor;
}

Doctor.prototype.save = function(callback) {
	var doctor = this.doctor;
	var newDoctor = new doctorModel(doctor);
	newDoctor.save(function(err, doctorItem) {
		if (err) {
			return callback(err);
		}
		callback(null, doctorItem);
	});
}

Doctor.getOne = function(query, callback, opts, fields, populate) {
	var options = opts || {};
	var fields = fields || null;
	var populate = populate || '';

	doctorModel
		.findOne(query, fields, opts)
		.populate(populate)
		.exec(function(err, doctorInfo) {
			if(err){
				return callback(err);
			}
			callback(null, doctorInfo);
		});
};


Doctor.getSome = function(query, callback, opts, fields, populate) {
	var options = opts || {};
	var fields = fields || null;
	var populate = populate || '';
	doctorModel
		.find(query, fields, options)
		.populate(populate)
		.exec(function(err, doctors) {
			if(err) {
				return callback(err);
			}
			callback(null, doctors);
		});
};

Doctor.updateOne = function(query, obj, callback, opts, populate) {
	var options = opts || {};
	var populate = populate || '';

	doctorModel
		.findOneAndUpdate(query, obj, options)
		.populate(populate)
		.exec(function(err, updoctor) {
			if(err){
				return callback(err);
			}
			callback(null, updoctor);
		});
};




module.exports = Doctor;