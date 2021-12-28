
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
