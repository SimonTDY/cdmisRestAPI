var	config = require('../config'),
	Doctor = require('../models/doctor'), 
	Team = require('../models/team'), 
	DpRelation = require('../models/dpRelation'), 
	Consultation = require('../models/consultation'), 
	Comment = require('../models/comment');

// //根据userId查询医生信息 2017-03-28 GY
// exports.getDoctor = function(req, res) {
// 	var _userId = req.query.userId
// 	var query = {userId:_userId};

// 	Doctor.getOne(query, function(err, item) {
// 		if (err) {
//       		return res.status(500).send(err.errmsg);
//     	}
//     	res.json({results: item});
// 	});
// }

//新建医生基本信息 2017-04-01 GY
exports.insertDocBasic = function(req, res) {
	if (req.body.userId == null || req.body.userId == '') {
		return res.json({result:'请填写userId!'});
	}
	var doctorData = {
		revisionInfo:{
			operationTime:new Date(),
			userId:"gy",
			userName:"gy",
			terminalIP:"10.12.43.32"
		}
	};
	if (req.body.userId != null){
		doctorData['userId'] = req.body.userId;
	}
	if (req.body.name != null){
		doctorData['name'] = req.body.name;
	}
	if (req.body.photoUrl != null){
		doctorData['photoUrl'] = req.body.photoUrl;
	}
	if (req.body.birthday != null){
		doctorData['birthday'] = new Date(req.body.birthday);
	}
	if (req.body.gender != null){
		doctorData['gender'] = req.body.gender;
	}
	if (req.body.IDNo != null){
		doctorData['IDNo'] = req.body.IDNo;
	}
	if (req.body.province != null){
		doctorData['province'] = req.body.province;
	}
	if (req.body.city != null){
		doctorData['city'] = req.body.city;
	}
	if (req.body.workUnit != null){
		doctorData['workUnit'] = req.body.workUnit;
	}
	if (req.body.title != null){
		doctorData['title'] = req.body.title;
	}
	if (req.body.job != null){
		doctorData['job'] = req.body.job;
	}
	if (req.body.department != null){
		doctorData['department'] = req.body.department;
	}
	if (req.body.major != null){
		doctorData['major'] = req.body.major;
	}
	if (req.body.descirption != null){
		doctorData['descirption'] = req.body.descirption;
	}
	if (req.body.charge1 != null){
		doctorData['charge1'] = req.body.charge1;
	}
	if (req.body.charge2 != null){
		doctorData['charge2'] = req.body.charge2;
	}

	var newDoctor = new Doctor(doctorData);
	newDoctor.save(function(err, doctorInfo) {
		if (err) {
      return res.status(500).send(err.errmsg);
    }
    res.json({result:'新建成功', newResults: doctorInfo});
	});
}

//根据doctorId获取所有团队 2017-03-29 GY
exports.getTeams = function(req, res) {
	if (req.query.userId == null || req.query.userId == '') {
        return res.json({result:'请填写userId!'});
    }
	//查询条件
	var _userId = req.query.userId
	//userId可能出现在sponsor或者是members里
	var query = {$or:[{sponsorId:_userId}, {'members.userId':_userId}]};

	//输出内容
	var opts = '';
	var fields = {"_id":0, 'revisionInfo':0};

	Team.getSome(query, function(err, item) {
		if (err) {
      		return res.status(500).send(err.errmsg);
    	}
    	res.json({results: item});
	}, opts, fields);
}

//通过doctor表中userId查询_id 2017-03-30 GY 
//修改：增加判断不存在ID情况 2017-04-05 GY
exports.getDoctorObject = function (req, res, next) {
	if (req.query.userId == null || req.query.userId == '') {
		return res.json({result:'请填写userId!'});
	}
    var query = { 
        userId: req.query.userId
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

//根据医生ID获取患者基本信息 2017-03-29 GY
exports.getPatientList = function(req, res) {
	//查询条件
	var doctorObject = req.body.doctorObject;
	var query = {doctorId:doctorObject._id};

	var opts = '';
	var fields = {'_id':0, 'patients.patientId':1};
	//通过子表查询主表，定义主表查询路径及输出内容
	var populate = {path: 'patients.patientId', select: {'_id':0, 'revisionInfo':0}};

	DpRelation.getSome(query, function(err, item) {
		if (err) {
      		return res.status(500).send(err.errmsg);
    	}
    	res.json({results: item});
	}, opts, fields, populate);
}

//通过team表中teamId查询teamObject 2017-03-30 GY 
exports.getTeamObject = function (req, res, next) {
	if (req.query.teamId == null || req.query.teamId == '') {
        return res.json({result:'请填写teamId!'});
    }
    if (req.query.status == null || req.query.status == '') {
        return res.json({result:'请填写status!'});
    }
	var _status = req.query.status;
    var query = { 
        teamId: req.query.teamId
    };
    //req.body.status = _status;
    Team.getOne(query, function (err, team) {
        if (err) {
            console.log(err);
            return res.status(500).send('服务器错误, 用户查询失败!');
        }
        if (team == null) {
        	return res.json({result:'不存在的teamId!'})
        }
        //req.body.teamObject = team;
        req.obj = {
        	teamObject:team, 
        	status:req.query.status
        };
        next();
    });
};

//通过team表中teamId查询teamObject 2017-04-14 WF
exports.getTeam = function (req, res, next) {
	return res.json({results: req.obj.teamObject});;
};

//根据teamId和status获取团队病例列表
exports.getGroupPatientList = function(req, res) {
	//查询条件
	var teamObject = req.obj.teamObject;
	//status在表中为数值类型，而从上一级传入的为字符串类型，需要转为数字，并且parseInt()后面的参数不可省略
	var _status = parseInt(req.obj.status, 10);
	var query = {teamId:teamObject._id, status:_status};

	var opts = '';
	var fields = {'_id':0, 'revisionInfo':0};
	//通过子表查询主表，定义主表查询路径及输出内容
	var populate = {
		path: 'diseaseInfo patientId', 
		select: {
			'_id':0, 'revisionInfo':0
		}
	};

	Consultation.getSome(query, function(err, item) {
		if (err) {
      		return res.status(500).send(err.errmsg);
    	}
    	res.json({results: item});
	}, opts, fields, populate);
}

// //
// exports.getDoctorInfo = function(req, res) {
// 	//查询条件
// 	var doctorObject = req.body.doctorObject;
// 	var query = {doctorId:doctorObject._id};

// 	var opts = '';
// 	var fields = {'_id':0, 'time':1, 'content':1, 'doctorId':1, 'patientId':1};
// 	//通过子表查询主表，定义主表查询路径及输出内容
// 	var populate = {
// 		path: 'doctorId patientId', 
// 		select: {
// 			'_id':0, 
// 			'userId':1, 'name':1, 'workUnit':1, 'title':1, 'department':1, 'major':1, 
// 			'descirption':1, 'score':1, 'charge1':1, 'charge2':1, 'photoUrl':1, 'schedules':1
// 		}
// 	};

// 	Comment.getSome(query, function(err, item) {
// 		if (err) {
//       		return res.status(500).send(err.errmsg);
//     	}
//     	res.json({results: item});
// 	}, opts, fields, populate);
// }

//修改获取医生详细信息方法 2017-4-12 GY
exports.getComments = function(req, res, next) {
	//查询条件
	var doctorObject = req.body.doctorObject;
	var query = {doctorId:doctorObject._id};

	var opts = '';
	var fields = {'_id':0, 'revisionInfo':0};
	//通过子表查询主表，定义主表查询路径及输出内容
	var populate = {
		path: 'patientId', 
		select: {
			'_id':0, 
			'userId':1, 'name':1
		}
	};

	Comment.getSome(query, function(err, items) {
		if (err) {
      		return res.status(500).send(err.errmsg);
    	}
    	// if (items.length === 0) {
    	// 	req.body.comments = '暂无评论！';
    	// }
    	else {
    		req.body.comments = items;
    	}
    	
    	next();
	}, opts, fields, populate);
}
// exports.getDoctorInfo = function(req, res){
// 	var query = {userId: req.query.userId};
// 	var comments = req.body.comments;
	
// 	var opts = '';
// 	var fields = {'_id':0, 'revisionInfo':0};
// 	var populate = '';

// 	Doctor.getOne(query, function (err, doctor) {
//         if (err) {
//             console.log(err);
//             return res.status(500).send('服务器错误, 用户查询失败!');
//         }
//         res.json({result:doctor, comments:comments});

//     }, opts, fields, populate);
// }
exports.getDoctorInfo = function(req, res) {
	var query = {userId:req.query.userId};
	var comments = req.body.comments;

	var newScore = 0;
	if (comments.length != 0) {
		var tempSum = 0;
		for (var i = 0; i < comments.length; i ++) {
			tempSum += comments[i].totalScore;
		}
		newScore = tempSum / comments.length;
	}
	else if (comments.length == 0) {
		newScore = 10;
	}

	var upObj = {
		score: newScore
	};

	Doctor.updateOne(query, upObj, function(err, upDoctor) {
		if (err){
			return res.status(422).send(err.message);
		}
		
		res.json({results:upDoctor, comments: comments});
	}, {new: true});
}

//修改医生个人信息 2017-04-12 GY
exports.editDoctorDetail = function(req, res) {
	if (req.body.userId == null || req.body.userId == '') {
		return res.json({result:'请填写userId!'});
	}
	var query = {
		userId: req.body.userId
	};
	
	var upObj = {
		revisionInfo:{
			operationTime:new Date(),
			userId:"gy",
			userName:"gy",
			terminalIP:"10.12.43.32"
		}
	};
	if (req.body.name != null){
		upObj['name'] = req.body.name;
	}
	if (req.body.photoUrl != null){
		upObj['photoUrl'] = req.body.photoUrl;
	}
	if (req.body.birthday != null){
		upObj['birthday'] = new Date(req.body.birthday);
	}
	if (req.body.gender != null){
		upObj['gender'] = req.body.gender;
	}
	if (req.body.IDNo != null){
		upObj['IDNo'] = req.body.IDNo;
	}
	if (req.body.province != null){
		upObj['province'] = req.body.province;
	}
	if (req.body.city != null){
		upObj['city'] = req.body.city;
	}
	if (req.body.workUnit != null){
		upObj['workUnit'] = req.body.workUnit;
	}
	if (req.body.title != null){
		upObj['title'] = req.body.title;
	}
	if (req.body.job != null){
		upObj['job'] = req.body.job;
	}
	if (req.body.department != null){
		upObj['department'] = req.body.department;
	}
	if (req.body.major != null){
		upObj['major'] = req.body.major;
	}
	if (req.body.descirption != null){
		upObj['descirption'] = req.body.descirption;
	}
	if (req.body.charge1 != null){
		upObj['charge1'] = req.body.charge1;
	}
	if (req.body.charge2 != null){
		upObj['charge2'] = req.body.charge2;
	}

	//return res.json({query: query, upObj: upObj});
	Doctor.updateOne(query, upObj, function(err, upDoctor) {
		if (err){
			return res.status(422).send(err.message);
		}
		if (upDoctor == null) {
			return res.json({result:'修改失败，不存在的医生ID！'})
		}
		res.json({result: '修改成功', editResults:upDoctor});
	}, {new: true});
}

//获取最近交流过的医生列表 2017-04-13 GY 
//按时间降序排列 2017-04-14 GY
exports.getRecentDoctorList = function(req, res) {
	//查询条件
	var doctorObject = req.body.doctorObject;
	var query = {doctorId:doctorObject._id};

	var opts = '';
	var fields = {'_id':0, 'doctors':1};
	//通过子表查询主表，定义主表查询路径及输出内容
	var populate = {path: 'doctors.doctorId', select: {'_id':0, 'revisionInfo':0}};

	//设置排序规则函数，时间降序
	function sortTime(a, b) {
		return b.lastTalkTime - a.lastTalkTime;
	}

	DpRelation.getOne(query, function(err, item) {
		if (err) {
      		return res.status(500).send(err.errmsg);
    	}
    	res.json({results: item.doctors.sort(sortTime)});
	}, opts, fields, populate);
}


exports.insertSchedule = function(req, res) {
	//查询条件
	var doctorId = req.body.userId;
	var _day=req.body.day;
	var _time=req.body.time;
	if(doctorId==""||doctorId==undefined||doctorId==null){
		return res.json({result:2,msg:"Please input doctorId!"});
	}
	else if(_day==""||_day==undefined||_day==null||_time==""||_time==undefined||_time==null){
		return res.json({result:1,msg:"Please input day and time!"});
	}
	else{
		var query = {userId:doctorId};
		var upObj = {
			$addToSet: {
				schedules: {
					day:_day,
					time:_time
				}
			}
		};
		//return res.json({query: query, upObj: upObj});
		Doctor.update(query, upObj, function(err, updoct) {
			if (err){
				return res.status(422).send(err.message);
			}
			if (updoct.nModified == 0) {
				return res.json({msg:'未成功修改！请检查输入是否符合要求！', results: updoct});
			}
			if (updoct.nModified == 1) {
				return res.json({msg:'修改成功', results: updoct});
			}
			res.json({results: updoct});
		}, {new: true});
	}
}
exports.deleteSchedule = function(req, res) {
	//查询条件
	var doctorId = req.body.userId;
	var _day=req.body.day;
	var _time=req.body.time;
	if(doctorId==""||doctorId==undefined||doctorId==null){
		return res.json({result:2,msg:"Please input doctorId!"});
	}
	else if(_day==""||_day==undefined||_day==null||_time==""||_time==undefined||_time==null){
		return res.json({result:1,msg:"Please input day and time!"});
	}
	else{
		var query = {userId:doctorId};
		var upObj = {
			$pull: {
				schedules: {
					day:_day,
					time:_time
				}
			}
		};
		//return res.json({query: query, upObj: upObj});
		Doctor.update(query, upObj, function(err, updoct) {
			if (err){
				return res.status(422).send(err.message);
			}
			if (updoct.nModified == 0) {
				return res.json({msg:'未成功修改！请检查输入是否符合要求！', results: updoct});
			}
			if (updoct.nModified == 1) {
				return res.json({msg:'修改成功', results: updoct});
			}
			res.json({results: updoct});
		}, {new: true});
	}
}
exports.getSchedules = function(req, res) {
	//查询条件
	var doctorId = req.query.userId;
	if(doctorId==""||doctorId==undefined||doctorId==null){
		return res.json({result:2,msg:"Please input doctorId!"});
	}
	else{
		var query = {userId:doctorId};
		var opts = '';
		var fields = {'_id':0, 'schedules':1};

		Doctor.getOne(query, function(err, item) {
			if (err) {
				return res.status(500).send(err.errmsg);
			}
			res.json({results: item});
		}, opts, fields);
	}
}

exports.insertSuspendTime = function(req, res) {
	//查询条件
	var doctorId = req.body.userId;
	var _start=req.body.start;
	var _end=req.body.end;
	if(doctorId==""||doctorId==undefined||doctorId==null){
		return res.json({result:2,msg:"Please input doctorId!"});
	}
	else if(_start==""||_start==undefined||_start==null||_end==""||_end==undefined||_end==null){
		return res.json({result:1,msg:"Please input start and end!"});
	}
	else{
		var query = {userId:doctorId};
		var upObj = {
			$addToSet: {
				suspendTime: {
					start:new Date(_start),
					end:new Date(_end)
				}
			}
		};
		//return res.json({query: query, upObj: upObj});
		Doctor.update(query, upObj, function(err, updoct) {
			if (err){
				return res.status(422).send(err.message);
			}
			if (updoct.nModified == 0) {
				return res.json({msg:'未成功修改！请检查输入是否符合要求！', results: updoct});
			}
			if (updoct.nModified == 1) {
				return res.json({msg:'修改成功', results: updoct});
			}
			res.json({results: updoct});
		}, {new: true});
	}
}
exports.deleteSuspendTime = function(req, res) {
	//查询条件
	var doctorId = req.body.userId;
	var _start=req.body.start;
	var _end=req.body.end;
	if(doctorId==""||doctorId==undefined||doctorId==null){
		return res.json({result:2,msg:"Please input doctorId!"});
	}
	else if(_start==""||_start==undefined||_start==null||_end==""||_end==undefined||_end==null){
		return res.json({result:1,msg:"Please input start and end!"});
	}
	else{
		var query = {userId:doctorId};
		var upObj = {
			$pull: {
				suspendTime: {
					start:new Date(_start),
					end:new Date(_end)
				}
			}
		};
		//return res.json({query: query, upObj: upObj});
		Doctor.update(query, upObj, function(err, updoct) {
			if (err){
				return res.status(422).send(err.message);
			}
			if (updoct.nModified == 0) {
				return res.json({msg:'未成功修改！请检查输入是否符合要求！', results: updoct});
			}
			if (updoct.nModified == 1) {
				return res.json({msg:'修改成功', results: updoct});
			}
			res.json({results: updoct});
		}, {new: true});
	}
}
exports.getSuspendTime = function(req, res) {
	//查询条件
	var doctorId = req.query.userId;
	if(doctorId==""||doctorId==undefined||doctorId==null){
		return res.json({result:2,msg:"Please input doctorId!"});
	}
	else{
		var query = {userId:doctorId};
		var opts = '';
		var fields = {'_id':0, 'suspendTime':1};

		Doctor.getOne(query, function(err, item) {
			if (err) {
				return res.status(500).send(err.errmsg);
			}
			res.json({results: item});
		}, opts, fields);
	}
}