const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');
const Record = require('../controllers/recordController');

router.get('/find',checkAuth, accessRules,Record.find);
router.post('/update',checkAuth, accessRules,Record.update);
router.post('/delete',checkAuth, accessRules,Record.delete);
router.get('/',checkAuth, accessRules, Record.show);
router.post('/',checkAuth, accessRules, Record.create);

router.get('/recordsByStudent',checkAuth, accessRules, Record.recordsByStudent);
router.post('/recordsByDay',checkAuth, accessRules, Record.recordsByDay);
router.post('/recordsByDayR',checkAuth, accessRules, Record.recordsByDayR);
router.get('/recordsBySchool',checkAuth, accessRules, Record.recordsBySchool);
router.get('/recordById',checkAuth, accessRules, Record.recordsByDay);
router.get('/countAttendancesByStudent',checkAuth, accessRules, Record.countAttendancesByStudent);
router.post('/attendancesByMonth', checkAuth, accessRules, Record.attendancesByMonth);
router.post('/attendancesByWeek', checkAuth, accessRules, Record.attendancesByWeek);

module.exports = router;