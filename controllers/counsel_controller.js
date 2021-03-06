var	config = require('../config'),
	Counsel = require('../models/counsel'), 
	Doctor = require('../models/doctor'), 
	Patient = require('../models/patient');


//根据状态、类型、获取咨询问诊信息 2017-03-28 GY
//暂未实现计数
//status 和type 传入参数
exports.getCounsels = function(req, res) {
	//查询条件
	var _doctorId = req.body.doctorObject._id;
	var _status = req.query.status;
	var _type = req.query.type;
	var query;

	//type和status可以为空
	if(_type == null && _status != null){
		query = {doctorId:_doctorId, status:_status};
	}
	else if(_type != null && _status == null){
		query = {doctorId:_doctorId, type:_type};
	}
	else if(_type == null && _status == null){
		query = {doctorId:_doctorId};
	}
	else{
		query = {doctorId:_doctorId, status:_status, type:_type};
	}
	
	
	var opts = '';
	var fields = {"_id":0, "doctorId":0, "messages":0, "revisionInfo":0};
	//关联主表patient获取患者信息
	var populate = {path: 'patientId', select:{'_id':0, 'name':1, 'gender':1, 'birthday':1, 'photoUrl':1}}

	Counsel.getSome(query, function(err, item) {
		if (err) {
      		return res.status(500).send(err.errmsg);
    	}
    	res.json({results: item, count:item.length});
	}, opts, fields, populate);
}

//获取患者ID对象(用于咨询问卷方法) 2017-04-05 GY
exports.getPatientObject = function (req, res, next) {
	if (req.body.patientId == null || req.body.patientId == '') {
		return res.json({result:'请填写patientId!'});
	}
    var query = { 
        userId: req.body.patientId
    };
    Patient.getOne(query, function (err, patient) {
        if (err) {
            console.log(err);
            return res.status(500).send('服务器错误, 用户查询失败!');
        }
        if (patient == null) {
        	return res.json({result:'不存在的患者ID！'});
        }
        req.body.patientObject = patient;
        next();
    });
};
//获取医生ID对象(用于咨询问卷方法) 2017-04-05 GY
exports.getDoctorObject = function (req, res, next) {
	if (req.body.doctorId == null || req.body.doctorId == '') {
		return res.json({result:'请填写doctorId!'});
	}
    var query = { 
        userId: req.body.doctorId
    };
    Doctor.getOne(query, function (err, doctor) {
        if (err) {
            console.log(err);
            return res.status(500).send('服务器错误, 用户查询失败!');
        }
        if (doctor == null) {
        	return res.json({result:'不存在的医生ID！'});
        }
        req.body.doctorObject = doctor;
        next();
    });
};
//提交咨询问卷 2017-04-05 GY
//增加选填字段 2017-04-13 GY
exports.saveQuestionaire = function(req, res) {

	var counselData = {
		counselId: req.newId, 						//counselpost01
		patientId: req.body.patientObject._id, 				//p01
		doctorId: req.body.doctorObject._id, 				//doc01
		// type: req.body.type, 
		time: new Date(), 
		// status: req.body.status, 
		// topic: req.body.topic, 
		// content: req.body.content, 
		// title: req.body.title, 
		sickTime: req.body.sickTime, 
		// visited: req.body.visited, 
		symptom: req.body.symptom, 
		symptomPhotoUrl: req.body.symptomPhotoUrl, 
		// description: req.body.description, 
		// drugs: req.body.drugs, 
		// history: req.body.history, 
		help: req.body.help, 
		// comment: req.body.comment, 

		revisionInfo:{
			operationTime:new Date(),
			userId:"gy",
			userName:"gy",
			terminalIP:"10.12.43.32"
		}
	};
	if(req.body.hospital != null && req.body.hospital != ''){
		counselData['hospital'] = req.body.hospital; 
	}
	if(req.body.visitDate != null && req.body.visitDate != ''){
		counselData['visitDate'] = new Date(req.body.visitDate); 
	}
	if(req.body.diagnosis != null && req.body.diagnosis != ''){
		counselData['diagnosis'] = req.body.diagnosis; 
	}
	if(req.body.diagnosisPhotoUrl != null && req.body.diagnosisPhotoUrl != ''){
		counselData['diagnosisPhotoUrl'] = req.body.diagnosisPhotoUrl; 
	}
 
	var newCounsel = new Counsel(counselData);
	newCounsel.save(function(err, counselInfo) {
		if (err) {
      return res.status(500).send(err.errmsg);
    }
    res.json({result: '新建成功', results: counselInfo});
	});
}

exports.changeCounselStatus = function(req, res) {
	if (req.body.counselId == null || req.body.counselId == '') {
		return res.json({result:'请填写counselId!'});
	}
	var query = {
		counselId: req.body.counselId
	};
	
	var upObj = {
		revisionInfo:{
			operationTime:new Date(),
			userId:'',
			userName:'',
			terminalIP:''
		}
	};
	if (req.body.status != null){
		upObj['status'] = req.body.status;
	}


	//return res.json({query: query, upObj: upObj});
	Counsel.updateOne(query, upObj, function(err, upCounsel) {
		if (err){
			return res.status(422).send(err.message);
		}
		if (upCounsel == null) {
			return res.json({result:'修改失败，不存在的counselId！'})
		}
		res.json({result: '修改成功', editResults:upCounsel});
	}, {new: true});
}