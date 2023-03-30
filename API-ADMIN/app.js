const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/* let */
const recordRoutes = require('./API/routes/records');
const schoolRoutes = require('./API/routes/schools');
const studentRoutes = require('./API/routes/students');
const userRoutes = require('./API/routes/users');
const tutorRoutes = require('./API/routes/tutors');
const teacherRoutes = require('./API/routes/teachers');
const configurationRoutes = require('./API/routes/configurations');
/* let */

mongoose.connect('mongodb://localhost:27017/asistencias');
mongoose.Promise = global.Promise;


app.set('view engine','jade');

app.get('/',function(req,res){
	res.render('main');
});

app.use(morgan('dev'));
app.use('/uploads',express.static('Uploads'));
//app.use('/react',express.static('static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers',
		'Origin, X-Requested-Width, Content-Type, Accept, Authorization'
		);
	res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');

	console.log(req.body);

	next();
});

app.options("/*",function(req,res,next){
	res.sendStatus(200);
});

/* let */
app.use('/registros',recordRoutes);
app.use('/colegios',schoolRoutes);
app.use('/alumnos',studentRoutes);
app.use('/usuarios',userRoutes);
app.use('/tutores',tutorRoutes);
app.use('/profesores',teacherRoutes);
app.use('/configuraciones',configurationRoutes)
/* let */

app.use((req,res,next)=>{
	const error = new Error('Page Not found');
	error.status = 404;
	next(error);
});

app.use((error,req,res,next)=>{
	res.status(error.status || 500);
	res.json({
		error:{
			message: error.message
		}
	});
});

module.exports = app;
