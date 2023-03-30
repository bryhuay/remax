const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');
const Tutor = require('../controllers/tutorController');

router.get('/find',checkAuth, accessRules,Tutor.find);
router.post('/update',checkAuth, accessRules,Tutor.update);
router.post('/delete',checkAuth, accessRules,Tutor.delete);
router.get('/',checkAuth, accessRules,Tutor.show);
router.post('/',checkAuth, accessRules, Tutor.create);
router.post('/searchByDNI',checkAuth, accessRules, Tutor.searchByDNI);
router.get('/tutorsBySchool',checkAuth, accessRules, Tutor.tutorsBySchool);
router.post('/tutorsBySchoolAndLastName',checkAuth, accessRules, Tutor.tutorsBySchoolAndLastName);
router.get('/appHeaders',checkAuth, accessRules, Tutor.appHeaders);
router.get('/appTutorInfo',checkAuth, accessRules, Tutor.appTutorInfo);



module.exports = router;