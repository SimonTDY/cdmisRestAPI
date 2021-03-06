
var mongoose = require('mongoose');

var healthInfoSchema = new mongoose.Schema({
	userId: String,						
	type: String, 
	insertTime: Date, 
	time: Date, 
	url: [String], 
	label: String, 
	description: String, 
	comments: String, 
	revisionInfo:{
		operationTime:Date,
		userId:String,
		userName:String,
		terminalIP:String
	}
});


var healthInfoModel = mongoose.model('healthInfo', healthInfoSchema);

function HealthInfo(healthInfo) {
	this.healthInfo = healthInfo;
}

HealthInfo.prototype.save = function(callback) {
	var healthInfo = this.healthInfo;
	var newHealthInfo = new healthInfoModel(healthInfo);
	newHealthInfo.save(function(err, healthInfoItem) {
		if (err) {
			return callback(err);
		}
		callback(null, healthInfoItem);
	});
}

HealthInfo.getOne = function(query, callback, opts, fields, populate) {
	var options = opts || {};
	var fields = fields || null;
	var populate = populate || '';

	healthInfoModel
		.findOne(query, fields, opts)
		.populate(populate)
		.exec(function(err, healthInfoInfo) {
			if(err){
				return callback(err);
			}
			callback(null, healthInfoInfo);
		});
};


HealthInfo.getSome = function(query, callback, opts, fields, populate) {
	var options = opts || {};
	var fields = fields || null;
	var populate = populate || '';
	healthInfoModel
		.find(query, fields, options)
		.populate(populate)
		.exec(function(err, healthInfos) {
			if(err) {
				return callback(err);
			}
			callback(null, healthInfos);
		});
};

HealthInfo.updateOne = function(query, obj, opts, callback, populate) {
	var options = opts || {};
	var populate = populate || '';

	healthInfoModel
		.findOneAndUpdate(query, obj, options)
		.populate(populate)
		.exec(function(err, uphealthInfo) {
			if(err){
				return callback(err);
			}
			callback(null, uphealthInfo);
		});
};

HealthInfo.remove = function(query, callback) {
	healthInfoModel
		.remove(query)
		.exec(function(err) {
			callback(err);
		});

};

HealthInfo.removeOne = function(query, callback, opts) {
	var options = opts || {};

	healthInfoModel
		.findOneAndRemove(query, options, function(err, health) {
			if (err) {
				return callback(err);
			}
			callback(null, health);
		});
};


module.exports = HealthInfo;


