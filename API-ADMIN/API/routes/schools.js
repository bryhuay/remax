const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middlewares/check-auth');
const accessRules = require('../middlewares/access-rules');
const School = require('../controllers/schoolController');

const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null,'./uploads/');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString().replace(/:/g,'-') + file.originalname);
	}
});

const fileFilter = (req,file,cb) => {
	//reject a file
	const img = file.mimetype.toLowerCase();
	
	if (img === 'image/png' || img === 'image/jpeg' || img === 'image/jpg') {
		cb(null, true);	
	}else{
		cb(null,false);
	}
};

const upload = multer({
	storage: storage, 
	limits: {
		fileSize: 1024 * 1024 * 5 
	},
	fileFilter: fileFilter
});

router.get('/find',checkAuth, accessRules,School.find);
router.post('/update',checkAuth, accessRules, upload.single('logo'), School.update);
router.post('/delete',checkAuth, accessRules,School.delete);
router.get('/img',checkAuth, accessRules, School.img);
router.get('/',checkAuth, accessRules, School.show);
router.post('/',checkAuth, accessRules, upload.single('logo'), School.create);

router.post('/edit',checkAuth, accessRules, School.edit);
router.post('/search',checkAuth, accessRules, School.search);

module.exports = router;