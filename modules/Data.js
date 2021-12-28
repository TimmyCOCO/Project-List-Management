const Sequelize = require('sequelize');

var sequelize = new Sequelize('d28fqpu74g0i2t', 'wdujodsexbhwzo',
    'fe6c1270f5c6fd6baf823afcb45d66457283d33fec39d27e5da0bc7de54bc3a8', {
        host: 'ec2-52-72-252-211.compute-1.amazonaws.com',
        dialect: 'postgres',
        port: 5432,
        dialectOptions: {
            ssl: { rejectUnauthorized: false }
        },
        query: { raw: true }
    });

// var Student = sequelize.define('Student', {
//     studentNum: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     firstName: Sequelize.STRING,
//     lastName: Sequelize.STRING,
//     email: Sequelize.STRING,
//     addressStreet: Sequelize.STRING,
//     addressCity: Sequelize.STRING,
//     addressProvince: Sequelize.STRING,
//     TA: Sequelize.BOOLEAN,
//     status: Sequelize.STRING
// })

var Project = sequelize.define('Project', {
    projectId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    projectName: Sequelize.STRING,
    projectDescription: Sequelize.STRING
})


// Initialize database
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(() => {
            resolve('success')
        }).catch(() => {
            reject('unable to sync the database');
        })
    });
}

//====================================
// Processing Project Data

// get all projects
module.exports.getProjects = function () {
    return new Promise(function (resolve, reject) {
        Project.findAll().then(allProjects => {
            resolve(allProjects);
        }).catch(() => {
            reject('no results returned');
        })
    });
}

// get the project by id
module.exports.getProjectById = function (id) {
    return new Promise(function (resolve, reject) {
        Project.findAll({
            where: {
                projectId: id
            }
        }).then(allProjects => {
            resolve(allProjects[0]);
        }).catch(() => {
            reject('no results returned');
        })
    });
}

// add project
module.exports.addProject = function (projectData) {
    for (prop in projectData) {
        if (projectData[prop] == '') {
            projectData[prop] = null;
        }
    }

    return new Promise((resolve, reject) => {
        Project.create(projectData).then(() => {
            resolve('success')
        }).catch(() => {
            reject('unable to create project')
        })
    })
}

// update project
module.exports.updateProject = function (projectData) {
    for (prop in projectData) {
        if (projectData[prop] == '') {
            projectData[prop] = null;
        }
    }
    
    return new Promise((resolve, reject) => {
        Project.update(
            projectData, {
                where: {
                    projectId: projectData.projectId
                }
            }
        ).then(() => {
            resolve('success')
        }).catch(() => {
            console.log('cannot update:' + projectData.projectName)
            reject('unable to update project')
        })
    })
}

// delete project
module.exports.deleteProjectById = function (id) {
    return new Promise((resolve, reject) => {
        Project.destroy({
            where: {
                projectId: id
            }
        }).then(() => {
            resolve('destroyed')
        }).catch(() => {
            reject('unable to delete')
        })
    })
}

//====================================




// // get all students
// module.exports.getAllStudents = function () {
//     return new Promise(function (resolve, reject) {
//         Student.findAll({
//             order: ['studentNum']
//         }).then(allStudent => {
//             resolve(allStudent);
//         }).catch(() => {
//             reject('no results returned');
//         })

//     });
// }

// // get all students by course id
// module.exports.getStudentsByCourse = function (course) {
//     return new Promise(function (resolve, reject) {
//         Student.findAll({
//             where: {
//                 course: course
//             }
//         }).then(allStudent => {
//             resolve(allStudent);
//         }).catch(() => {
//             reject('no results returned');
//         })
//     });
// }

// // get all students who are TAs
// module.exports.getTAs = function () {
//     return new Promise(function (resolve, reject) {
//         Student.findAll({
//             where: {
//                 TA: true
//             }
//         }).then(allStudent => {
//             resolve(allStudent);
//         }).catch(() => {
//             reject('no results returned');
//         })

//     });
// }


// // get the student by number
// module.exports.getStudentByNum = function (num) {
//     return new Promise(function (resolve, reject) {
//         Student.findAll({
//             where: {
//                 studentNum: num
//             }
//         }).then(allStudent => {
//             resolve(allStudent[0]);
//         }).catch(() => {
//             reject('no results returned');
//         })
//     })
// }


// // add student 
// module.exports.addStudent = function (studentData) {

//     for (prop in studentData) {
//         if(studentData[prop] == ''){
//             studentData[prop] = null;
//         }
//     }
//     studentData.TA = (studentData.TA) ? true : false;

//     return new Promise(function (resolve, reject) {
//         Student.create(studentData).then(() => {
//             resolve("success");
//         }).catch(() => {
//             reject('unable to create student');
//         })

//     });
// }

// // update student
// module.exports.updateStudent = function (studentData) {

//     for (prop in studentData) {
//         if(studentData[prop] == ''){
//             studentData[prop] = null;
//         }
//     }
//     studentData.TA = (studentData.TA) ? true : false;

//     return new Promise(function (resolve, reject) {
//         Student.update(
//             studentData,{
//                 where:{
//                     studentNum : studentData.studentNum
//                 }
//             }
//         ).then(() => {
//             resolve('success')
//         }).catch(() => {
//             reject('unable to update student')
//         })
//     });
// }



// // delete student
// module.exports.deleteStudentByNum = function(studentNum){
//     return new Promise((resolve,reject)=>{
//         Student.destroy({
//             where:{
//                 studentNum : studentNum
//             }
//         }).then(()=>{
//             resolve("destroyed")
//         }).catch(()=>{
//             reject('unable to delete')
//         })
//     })
// }