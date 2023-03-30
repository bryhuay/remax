const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try{
		const token = req.headers.authorization.split(" ")[1];
		console.log("check auth token: " + token);
		const decoded = jwt.verify(token,'secret');
		console.log("check auth decoded: " + decoded);
		req.userData = decoded;
		next();
	}catch(error){
		return res.status(401).json({
			message: 'Auth failed',
		});
	}
};