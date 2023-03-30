const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');
const Student = require('../controllers/studentController');

router.post('/find',checkAuth, accessRules,Student.find);
router.post('/update',checkAuth, accessRules,Student.update);
router.post('/delete',checkAuth, accessRules,Student.delete);
router.get('/',checkAuth, accessRules, Student.show);
router.post('/',checkAuth, accessRules, Student.create);

router.get('/studentsByTutor',checkAuth, accessRules, Student.studentsByTutor);
router.get('/studentsByTeacher',checkAuth, accessRules, Student.studentsByTeacher);
router.get('/studentByFingerAndSchool',checkAuth, accessRules, Student.studentByFingerAndSchool);
router.get('/studentsBySchool',checkAuth, accessRules, Student.studentsBySchool);
router.post('/studentsBySchool',checkAuth, accessRules, Student.studentsBySchool);
router.post('/studentsBySchoolAndYear',checkAuth, accessRules, Student.studentsBySchoolAndYear);
router.post('/studentsBySchoolAndYearAndSection',checkAuth, accessRules, Student.studentsBySchoolAndYearAndSection);
router.post('/searchByName',checkAuth, accessRules, Student.searchByName);
router.post('/searchByLastName',checkAuth, accessRules, Student.searchByLastName);

module.exports = router;