
const express = require('express');
const app = express();
const path = require('path');

// handlebars module
const exphbs = require('express-handlebars');

// configure handlebars
app.engine('.hbs', exphbs({
    extname: '.hbs',
    layout: 'main',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },

        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.set('view engine', '.hbs');


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// fix navigation bar
app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == '/') ? '/' : route.replace(/\/$/, '');
    next();
});

const HTTP_PORT = process.env.PORT || 8080;


const Data = require("./modules/Data");


// Get all students or some students
// app.get('/students', (req, res) => {
//     // if have parameter, then Get some students via course number
//     if (req.query.course) {
//         Data.getStudentsByCourse(req.query.course).then(data => {
//             //res.json(data);
//             if (data.length > 0) {
//                 res.render("students", {
//                     students: data
//                 });
//             } else {
//                 res.render("students", {
//                     message: "no results"
//                 });
//             }
//         }).catch(() => {
//             // res.status(500).json({ message: "no results" });
//             res.render("students", {
//                 message: "no results"
//             });
//         });

//     } else { // if don't have paramter, then Get all students
//         Data.getAllStudents().then(data => {
//             // res.json(data);    
//             if (data.length > 0) {
//                 res.render("students", {
//                     students: data
//                 });
//             } else {
//                 res.render("students", {
//                     message: "no results"
//                 });
//             }
//         }).catch(() => {
//             // res.status(500).json({ message: "no results" });
//             res.render("students", {
//                 message: "no results"
//             });
//         });
//     }
// })


// app.get("/student/:studentNum", (req, res) => {
//     // initialize an empty object to store the values
//     let viewData = {};
//     Data.getStudentByNum(req.params.studentNum).then((data) => {
//         if (data) {
//             viewData.student = data; //store student data in the "viewData" object as "student"
//         } else {
//             viewData.student = null; // set student to null if none were returned
//         }
//     }).catch(() => {
//         viewData.student = null; // set student to null if there was an error
//     }).then(Data.getCourses)
//         .then((data) => {
//             viewData.courses = data; // store course data in the "viewData" object as "courses"
//             // loop through viewData.courses and once we have found the courseId that matches
//             // the student's "course" value, add a "selected" property to the matching
//             // viewData.courses object
//             for (let i = 0; i < viewData.courses.length; i++) {
//                 if (viewData.courses[i].courseId == viewData.student.course) {
//                     viewData.courses[i].selected = true;
//                 }
//             }
//         }).catch(() => {
//             viewData.courses = []; // set courses to empty if there was an error
//         }).then(() => {
//             if (viewData.student == null) { // if no student - return an error
//                 res.status(404).send("Student Not Found");
//             } else {
//                 res.render("student", { viewData: viewData }); // render the "student" view
//             }
//         });
// });

//=====================================================
// Processing Project Pages and Data

// display add project page
app.get('/project/addProjectPage', (req, res) => {
    res.render('static/addProjectPage')
})

// Get all projects
app.get('/projects', (req, res) => {
    Data.getProjects().then(data => {
        if (data.length > 0) {
            res.render("static/projects", {
                projects: data
            });
        } else {
            res.render("static/projects", {
                message: "no results"
            });
        }
    }).catch(() => {
        res.render("static/projects", {
            message: "no results"
        });
    });
});

// Get all projects
app.get('/projectList', (req, res) => {
    Data.getProjects().then(data => {
        if (data.length > 0) {
            res.render("projectList", {
                projects: data
            });
        } else {
            res.render("static/projects", {
                message: "no results"
            });
        }
    }).catch(() => {
        res.render("static/projects", {
            message: "no results"
        });
    });
});

// Get project by projectId
app.get('/project/:id', (req, res) => {
    Data.getProjectById(req.params.id).then(data => {
        if (data) {
            res.render("project", {
                project: data
            });
        }
    }).catch(() => {
        res.status(404).send('Project Not Found');
    })
})


// Add Project
app.post('/project/add', (req, res) => {
    Data.addProject(req.body).then(() => {
        res.redirect("/projectList");
    })
})

// Update Project
app.post('/project/update', (req, res) => {
    Data.updateProject(req.body).then(() => {
        res.redirect("/projectList");
    })
})

// Delete Project
app.get('/project/delete/:id', (req, res) => {
    Data.deleteProjectById(req.params.id).then(() => {
        res.redirect("/projectList");
    }).catch(() => {
        res.status(500).send("Unable to Remove Project / Project Not Found");
    })
})

//=====================================================

// // display add student page
// app.get('/students/add/', (req, res) => {
//     collegeData.getCourses().then((data) => {
//         res.render('addStudent', {
//             courses: data
//         });
//     }).catch(() => {
//         res.render('addStudent', {
//             courses: []
//         })
//     })

// })

// // Add Student
// app.post('/students/add', (req, res) => {
//     collegeData.addStudent(req.body).then(() => {
//         res.redirect("/students")
//     })
// })

// // Update Student
// app.post('/student/update', (req, res) => {
//     //console.log(req.body);
//     collegeData.updateStudent(req.body).then(() => {
//         res.redirect("/students");
//     })
// })






// delete student
app.get('/student/delete/:studentNum', (req, res) => {
    collegeData.deleteStudentByNum(req.params.studentNum).then(() => {
        res.redirect('/students');
    }).catch(() => {
        res.status(500).send('Unable to Remove Student / Student Not Found')
    })
})


// Home Page
app.get('/', (req, res) => {
    res.render('static/home');
})

// About Page
app.get('/about', (req, res) => {
    res.render('static/about');
})

// Projects Page
app.get('/projects', (req, res) => {
    res.render('static/projects');
})

// display 404 custom page if route not found
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '/public/404.png'));
})


// start service 
Data.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("server listening on port: " + HTTP_PORT);
    });
}).catch((err) => {
    console.log(err);
})
