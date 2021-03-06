
// 3rd packages


// self-defined configurations
var config = require('../config');

// middlewares
var getNoMid = require('../middlewares/getNoMid');

// controllers
var dictTypeTwoCtrl = require('../controllers/dictTypeTwo_controller'),

    userCtrl = require('../controllers/user_controller'),
    healthInfoCtrl = require('../controllers/healthInfo_controller'),
    dictNumberCtrl = require('../controllers/dictNumber_controller'),
    loadCtrl = require('../controllers/load_controller');

  
    dictTypeOneCtrl = require('../controllers/dictTypeOne_controller'),
    dictDistrictCtrl = require('../controllers/dictDistrict_controller'),
    dictHospitalCtrl = require('../controllers/dictHospital_controller'),
    taskCtrl = require('../controllers/task_controller'),
    complianceCtrl = require('../controllers/compliance_controller');

// controllers updated by GY 
var doctorCtrl = require('../controllers/doctor_controller'), 
    counselCtrl = require('../controllers/counsel_controller'), 
    patientCtrl = require('../controllers/patient_controller'), 
    commentCtrl = require('../controllers/comment_controller'), 
    vitalSignCtrl = require('../controllers/vitalSign_controller'), 
    accountCtrl = require('../controllers/account_controller'), 
    communicationCtrl = require('../controllers/communication_controller'), 
    messageCtrl = require('../controllers/message_controller');

var wechatCtrl = require('../controllers/wechat_controller');

module.exports = function(app,webEntry) {
  
  //app.use('/static', express.static( './static')).
  //    use('/images', express.static( '../images')).
  //    use('/lib', express.static( '../lib')
  //);
  app.get('/', function(req, res){
    //console.log("Connected successfully to server and response");
    //res.render('rich_ui');
    res.send("Server Root");
  });

  // csq 
  app.get('/dict/typeTwo', dictTypeTwoCtrl.getCategory);
  app.get('/dict/typeTwo/codes', dictTypeTwoCtrl.getTypes);
  app.get('/user', userCtrl.getUserList);
  app.get('/user/insert', userCtrl.insertUser);
  app.get('/user/one', userCtrl.getUser);

  app.get('/dict/typeOne', dictTypeOneCtrl.getCategory);
  app.get('/dict/district', dictDistrictCtrl.getDistrict);
  app.get('/dict/hospital', dictHospitalCtrl.getHospital);
  app.get('/tasks', taskCtrl.getTasks);
  app.get('/tasks/status', taskCtrl.updateStatus);
  app.get('/tasks/time', taskCtrl.updateStartTime);
  // app.post('/compliance', complianceCtrl.insertOne);
  app.get('/compliance', complianceCtrl.getComplianceByDay);

  // wf
  app.post('/user/register', userCtrl.register);
  app.post('/user/reset', userCtrl.reset);
  app.post('/user/login', userCtrl.login);
  app.post('/user/logout', userCtrl.logout);
  app.get('/user/getUserID', userCtrl.getUserID);
  app.post('/user/sendSMS', userCtrl.sendSMS);
  app.get('/user/verifySMS', userCtrl.verifySMS);
  app.get('/user/getUserAgreement', userCtrl.getUserAgreement);
  app.post('/user/updateUserAgreement', userCtrl.updateUserAgreement);
  app.get('/healthInfo/getAllHealthInfo', healthInfoCtrl.getAllHealthInfo);
  app.get('/healthInfo/getHealthDetail', healthInfoCtrl.getHealthDetail);
  app.post('/healthInfo/insertHealthInfo', healthInfoCtrl.insertHealthInfo);
  app.post('/healthInfo/modifyHealthDetail', healthInfoCtrl.modifyHealthDetail);
  app.post('/healthInfo/deleteHealthDetail', healthInfoCtrl.deleteHealthDetail);
  app.get('/dictNumber/getNo', getNoMid.getNo(), dictNumberCtrl.getNo);
  // app.get('/user/getIp', userCtrl.getIp); 
  app.post('/upload', loadCtrl.uploadphoto(), loadCtrl.upload);
  // app.get('/download',loadCtrl.download);


  //routes updated by GY
  //说明：测试需要，post方法返回的均为post内容，测试通过需要修改为成功或失败
  //doctor_Info
  app.post('/doctor/postDocBasic', doctorCtrl.insertDocBasic);
  //需要查询class字典表（待定）
  app.get('/doctor/getPatientList', doctorCtrl.getDoctorObject, doctorCtrl.getPatientList);
  // app.get('/doctor/getDoctorInfo', doctorCtrl.getDoctorObject, doctorCtrl.getDoctorInfo);
  app.get('/doctor/getDoctorInfo', doctorCtrl.getDoctorObject, doctorCtrl.getComments, doctorCtrl.getDoctorInfo);
  app.get('/doctor/getMyGroupList', doctorCtrl.getTeams);
  app.get('/doctor/getGroupPatientList', doctorCtrl.getTeamObject, doctorCtrl.getGroupPatientList);
  app.get('/doctor/getTeam', doctorCtrl.getTeamObject, doctorCtrl.getTeam);
  app.post('/doctor/editDoctorDetail', doctorCtrl.editDoctorDetail);
  app.get('/doctor/getRecentDoctorList', doctorCtrl.getDoctorObject, doctorCtrl.getRecentDoctorList);
  app.post('/doctor/insertSchedule', doctorCtrl.insertSchedule);
  app.post('/doctor/deleteSchedule', doctorCtrl.deleteSchedule);
  app.get('/doctor/getSchedules', doctorCtrl.getSchedules);
  app.post('/doctor/insertSuspendTime', doctorCtrl.insertSuspendTime);
  app.post('/doctor/deleteSuspendTime', doctorCtrl.deleteSuspendTime);
  app.get('/doctor/getSuspendTime', doctorCtrl.getSuspendTime);
  //counsel
  app.get('/counsel/getCounsels', doctorCtrl.getDoctorObject, counselCtrl.getCounsels);
  app.post('/counsel/questionaire', counselCtrl.getPatientObject, counselCtrl.getDoctorObject, getNoMid.getNo(2), counselCtrl.saveQuestionaire);
  app.post('/counsel/changeCounselStatus', counselCtrl.changeCounselStatus);

  //patient_Info
  app.get('/patient/getPatientDetail', patientCtrl.getPatientDetail);
  app.get('/patient/getMyDoctors', patientCtrl.getMyDoctor);
  app.post('/patient/insertDiagnosis', patientCtrl.getDoctorObject, patientCtrl.insertDiagnosis);
  app.get('/patient/getDoctorLists', patientCtrl.getDoctorLists);
  app.post('/patient/newPatientDetail', patientCtrl.checkPatientId, patientCtrl.newPatientDetail);
  app.post('/patient/editPatientDetail', patientCtrl.editPatientDetail)
  app.get('/patient/getCounselRecords', patientCtrl.getPatientObject, patientCtrl.getCounselRecords);
  app.post('/patient/bindingMyDoctor', patientCtrl.bindingMyDoctor)
  //comment_query
  app.get('/comment/getComments', doctorCtrl.getDoctorObject, commentCtrl.getCommentsByDoc);

  //vitalSign_query
  app.get('/vitalSign/getVitalSigns', patientCtrl.getPatientObject, vitalSignCtrl.getVitalSigns);
  app.post('/vitalSign/insertVitalSign', vitalSignCtrl.getPatientObject, vitalSignCtrl.getVitalSign, vitalSignCtrl.insertData);

  //account_Info
  //需要和user表连接
  //无法输出expenseRecords数据，暂时无法解决问题
  app.get('/account/getAccountInfo', accountCtrl.getAccountInfo);

  //message
  app.get('/message/getMessages', messageCtrl.getMessages);
  app.post('/message/changeMessageStatus', messageCtrl.changeMessageStatus);

  //communication
  app.get('/communication/getCounselReport', communicationCtrl.getCounselReport);
  app.post('/communication/insertMember', communicationCtrl.insertMember);
  app.post('/communication/removeMember', communicationCtrl.removeMember);
  // app.post('/communication/newTeam', getNoMid.getNo(4), communicationCtrl.newTeam);
  app.post('/communication/newTeam', communicationCtrl.newTeam);
  app.get('/communication/getTeam', communicationCtrl.getTeam);
  // app.post('/communication/newConsultation', getNoMid.getNo(5), communicationCtrl.checkTeam, communicationCtrl.checkCounsel, communicationCtrl.checkPatient, communicationCtrl.checkDoctor, communicationCtrl.newConsultation);
  app.post('/communication/newConsultation', communicationCtrl.checkTeam, communicationCtrl.checkCounsel, communicationCtrl.checkPatient, communicationCtrl.checkDoctor, communicationCtrl.newConsultation);
  app.post('/communication/conclusion', communicationCtrl.conclusion);
  app.post('/communication/updateLastTalkTime', communicationCtrl.getDoctor1Object, communicationCtrl.getDoctor2Object, communicationCtrl.removeDoctor, communicationCtrl.updateLastTalkTime);
  //app.get('/communication/getMessages');
  //app.get('/communication/getConsultation');

  //task
  app.post('/tasks/insertTaskModel', taskCtrl.removeOldTask, taskCtrl.getTaskModel, taskCtrl.insertTaskModel);
  app.get('/tasks/getUserTask', taskCtrl.getUserTask);
  app.post('/tasks/updateUserTask', taskCtrl.getContent, taskCtrl.removeContent, taskCtrl.updateContent);

  //compliance
  app.post('/compliance/update', complianceCtrl.getCompliance, complianceCtrl.updateCompliance);


  // weixin wechatCtrl
  app.get('/wechat/settingConfig', wechatCtrl.getAccessTokenMid,wechatCtrl.wxJsApiTicket, wechatCtrl.settingConfig);
  app.get('/wechat/getUserInfo', wechatCtrl.gettokenbycode,wechatCtrl.getuserinfo);


  //app.get('/find',function(req, res){
  //  var url_parts = url.parse(req.url, true);
  //  var query = url_parts.query;
  //  res.send('Finding Book: Author: ' + query.author + ' Title: ' + query.title);
  //});
  // app.get('/user/:userid', function(req, res){
  //   res.send("Get User: " + req.param("userid"));
  // });
};

