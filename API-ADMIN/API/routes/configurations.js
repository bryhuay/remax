const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');
const SchoolConf = require('../controllers/configurationController');

router.get('/find',checkAuth, accessRules,SchoolConf.find);
router.get('/edit',checkAuth, accessRules,SchoolConf.edit);
router.post('/edit',checkAuth, accessRules,SchoolConf.edit);
router.post('/update',checkAuth, accessRules,SchoolConf.update);
router.post('/delete',checkAuth, accessRules,SchoolConf.delete);
router.get('/',checkAuth, accessRules, SchoolConf.show);
router.post('/',checkAuth, accessRules, SchoolConf.create);

router.post('/appSchoolConfig',checkAuth, accessRules, SchoolConf.appSchoolConfig);

module.exports = router;