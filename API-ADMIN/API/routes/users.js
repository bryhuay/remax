const express = require('express');
const router = express.Router();
const User = require('../controllers/userController');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');

router.post('/password', accessRules, User.password);
router.post('/login',User.login);
router.get('/find',checkAuth, accessRules, User.find);
router.post('/search',checkAuth, accessRules, User.search);
router.get('/headers',checkAuth, accessRules, User.headers);
router.post('/edit',checkAuth, accessRules, User.edit);
router.get('/getUserById', checkAuth, accessRules, User.getUserById);
router.post('/update',checkAuth, accessRules, User.update);
router.get('/delete',checkAuth, accessRules, User.delete);
router.post('/',checkAuth, accessRules, User.create);
router.get('/',checkAuth, accessRules, User.show);

router.get('/usersByType',checkAuth,accessRules,User.usersByType);
router.post('/usersByType',checkAuth,accessRules,User.usersByType);
router.get('/usersBySchool',checkAuth,accessRules,User.usersBySchool);
//router.post('/usersBySchool',checkAuth,accessRules,User.usersBySchool);
router.post('/usersByTypeAndSchool',checkAuth,accessRules,User.usersByTypeAndSchool);

module.exports = router;