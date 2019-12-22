"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metrics_1 = require("./metrics");
var users_1 = require("./users");
var path = require("path");
var bodyparser = require("body-parser");
var morgan = require("morgan");
var session = require("express-session");
var levelSession = require("level-session-store");
var app = express();
var LevelStore = levelSession(session);
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(express.static(path.join(__dirname, '/../public')));
app.set('views', __dirname + "/../views");
app.set('view engine', 'ejs');
app.get('/hello/:name', function (req, res) {
    res.render('hello.ejs', { name: req.params.name });
});
var dbMet = new metrics_1.MetricsHandler('./db/metrics');
app.get('/metrics/:id', function (req, res) {
    console.log("get oki");
    dbMet.get(req.params.id, function (err, result) {
        if (err)
            throw err;
        res.json(result);
    });
});
app.post('/metrics/:id', function (req, res) {
    dbMet.save(req.params.id, req.body, function (err) {
        if (err)
            throw err;
        res.status(200).send();
    });
});
app.delete('/metrics/:id', function (req, res) {
    dbMet.delete(req.params.id, req.body, function (err) {
        if (err)
            throw err;
        res.status(200).send();
    });
});
var dbUser = new users_1.UserHandler('./db/users');
var authRouter = express.Router();
authRouter.get('/login', function (req, res) {
    res.render('login');
});
authRouter.get('/signup', function (req, res) {
    res.render('signup');
});
authRouter.post('/signup', function (req, res) {
    var NewUser = new users_1.User(req.body.username, req.body.email, req.body.password, false);
    dbUser.save(NewUser, function (err) {
        if (err)
            throw err;
        res.status(200).send();
        res.redirect('/login');
    });
});
authRouter.get('/logout', function (req, res) {
    delete req.session.loggedIn;
    delete req.session.user;
    res.redirect('/login');
});
authRouter.post('/login', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (err)
            next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login');
        }
        else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/');
        }
    });
});
app.use(authRouter);
var userRouter = express.Router();
userRouter.post('/', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists");
        }
        else {
            dbUser.save(req.body, function (err) {
                if (err)
                    next(err);
                else
                    res.status(201).send("user persisted");
            });
        }
    });
});
userRouter.get('/:username', function (req, res, next) {
    dbUser.get(req.params.username, function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("user not found");
        }
        else
            res.status(200).json(result);
    });
});
app.use('/user', userRouter);
var authCheck = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect('/login');
};
app.get('/', authCheck, function (req, res) {
    res.render('index', { name: req.session.username });
});
app.set('port', 8080);
app.listen(app.get('port'), function () { return console.log("server listening on " + app.get('port')); });
