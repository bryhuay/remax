const jwt = require('jsonwebtoken');

class Rules {
	constructor(createOwn, readOwn, updateOwn, deleteOwn, createAny, readAny, updateAny, deleteAny){
		this.createOwn = createOwn;
		this.readOwn = readOwn;
		this.updateOwn = updateOwn;
		this.deleteOwn = deleteOwn;
		this.createAny = createAny;
		this.readAny = readAny;
		this.updateAny  = updateAny;
		this.deleteAny = deleteAny;
	}
}

class TableRules {
	constructor(roleRules){
		var roles = new Array();

		for(var i = 0; i < 5; i++){
			var rules = new Rules(	roleRules[i][0], roleRules[i][1], roleRules[i][2], roleRules[i][3],
									roleRules[i][4], roleRules[i][5], roleRules[i][6], roleRules[i][7],
									roleRules[i][8]	);
			roles.push(rules);
		}

		this.ADMIN_RULES = roles[0];
		this.DIRECTOR_RULES = roles[1];
		this.TUTOR_RULES = roles[2];
		this.DOORMAN_RULES = roles[3];
		this.TEACHER_RULES = roles[4];
	}
}

function can(role,action,table){
	console.log("Role: " + role + " - Action: " + action +" - Table: " + table);

	var completeRules = {
		record : new TableRules(new Array(
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true]
						)),
		school : new TableRules(new Array(
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true]
						)),
		student : new TableRules(new Array(
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true]
						)),
		tutor : new TableRules(new Array(
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true]
						)),
		user : new TableRules(new Array(
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true]
						)),
		teacher : new TableRules(new Array(
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true]
						)),
		configuration : new TableRules(new Array(
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true],
							[true,true,true,true,true,true,true,true]
						)),
	}

	//var a = completeRules[transformTable(table)][role][action];
	if(completeRules[transformTable(table)][role][action]){
		return true;
	}

	return false;
}

function transformTable(table){
	switch (table){
		case "registros": return "record";break;
		case "colegios": return "school" ;break;
		case "alumnos": return "student" ;break;
		case "tutores": return "tutor" ;break;
		case "usuarios": return "user" ;break;
		case "profesores": return "teacher" ;break;
		case "configuraciones": return "configuration"; break;
	}
		
}

function tranformAction(table,url,method){

	//console.log("Role: " + role + " - Action: " + action +" - Table: " + table);

	switch(table){
		case "registros":
			switch(url){
				case "/find": return "readAny"; break;
				case "/update": return "updateAny"; break;
				case "/delete": return "deleteAny"; break;
				case "/": return (method == "POST")?"createAny":"readAny"; break;

				case "/recordsByStudent": return "readOwn" ; break;
				case "/recordsBySchool": return "readAny" ; break;
				case "/recordById": return "readOwn" ; break;
				case "/recordsByDay": return "readAny" ; break;
				case "/recordsByDayR": return "readAny" ; break;
				case "/countAttendancesByStudent": return "readAny"; break;
				case "/attendancesByMonth": return "readAny"; break;
				case "/attendancesByWeek": return "readAny"; break;
				default: return ""; break;
			}
			break;
		case "colegios":
			switch(url){
				case "/find": return "readAny"; break;
				case "/update": return "updateAny"; break;
				case "/delete": return "deleteAny"; break;
				case "/img": return "readAny"; break;
				case "/": return (method == "POST")?"createAny":"readAny"; break;

				case "/edit": return "updateOwn"; break;
				case "/search": return "readAny"; break;
				default: return ""; break;
			}
			break;
		case "alumnos":
			switch(url){
				case "/find": return "readAny"; break;
				case "/update": return "updateAny"; break;
				case "/delete": return "deleteAny"; break;
				case "/": return (method == "POST")?"createAny":"readAny"; break;

				case "/studentsByTutor": return "readOwn"; break;
				case "/studentByFingerAndSchool": return "readAny"; break;				
				case "/studentsByTeacher": return "readOwn"; break;
				case "/studentsBySchool": return "readOwn"; break;
				case "/studentsBySchoolAndYear": return "readOwn"; break;
				case "/studentsBySchoolAndYearAndSection": return "readOwn"; break;
				case "/searchByName": return "readAny"; break;
				case "/searchByLastName": return "readAny"; break;

				default: return ""; break;
			}
			break;
		case "tutores":
			switch(url){
				case "/find": return "readAny"; break;
				case "/update": return "updateAny"; break;
				case "/delete": return "deleteAny"; break;
				case "/": return (method == "POST")?"createAny":"readAny"; break;
				case "/searchByDNI": return "readAny"; break;
				case "/tutorsBySchool": return "readAny"; break;
				case "/tutorsBySchoolAndLastName": return "readAny"; break;
				case "/appHeaders": return "readOwn"; break;
				case "/appTutorInfo": return "readOwn"; break;
				default: return ""; break;
			}
			break;
		case "usuarios":
			switch(url){
				case "/find": return "readAny"; break;
				case "/password": return "updateAny"; break;
				case "/login": return "readOwn"; break;
				case "/search": return "readAny"; break;
				case "/headers": return "readOwn"; break;
				case "/edit": return "updateOwn"; break;
				case "/getUserById": return "readAny"; break;
				case "/update": return "updateAny"; break;
				case "/delete": return "deleteAny"; break;
				case "/": return (method == "POST")?"createAny":"readAny"; break;
				
				case "/usersByType": return "readAny"; break;
				case "/usersBySchool": return "readOwn"; break;
				case "/usersByTypeAndSchool": return "readOwn"; break;
				default: return ""; break;
			}
			break;
		case "profesores":
			switch(url){
				case "/find": return "readAny"; break;
				case "/update": return "updateAny"; break;
				case "/delete": return "deleteAny"; break;
				case "/teachersBySchool": return "readAny"; break;
				case "/appTeacherInfo": return "readAny"; break;				
				case "/teachersBySchoolAndLastName": return "readAny"; break;
				case "/": return (method == "POST")?"createAny":"readAny"; break;

				default: return ""; break;
			}
			break;
		case "configuraciones":
			switch(url){
				case "/find": return "readAny"; break;
				case "/edit": return "readAny"; break;
				case "/update": return "updateAny"; break;
				case "/delete": return "deleteAny"; break;
				case "/": return (method == "POST")?"createAny":"readAny"; break;

				case "/appSchoolConfig": return "readOwn"; break;
				default: return ""; break;
			}
		default: return "";
	}
}

module.exports = (req, res, next) => {
	try{
		console.log("access rules");

		var role = req.userData.type + "_RULES";
		var action = req.url;
		var table = req.originalUrl;

		table = table.substr(1,table.length-1);
		table = (table.indexOf("/")>-1)?table.substr(0,table.indexOf("/")):table;

		action = (action.indexOf("?")>-1)?action.substr(0, action.indexOf("?")):action;

		if(	can(role, 
				tranformAction(table,action,req.method), 
				table)
		)
		{
			console.log("success");
			next();
		} else {
			res.status(403).end();
		}
	}
	catch(error){
		return res.status(401).json({
			message: 'Access Denied'
		});
	}
};
