"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
//import bcrypt = require ('bcrypt')
var bcrypt = require('bcrypt');
var User = /** @class */ (function () {
    function User(username, email, password, passwordHashed) {
        if (passwordHashed === void 0) { passwordHashed = false; }
        this.password = "";
        this.username = username;
        this.email = email;
        if (!passwordHashed) {
            this.setPassword(password);
        }
        else
            this.password = password;
    }
    User.fromDb = function (username, value) {
        console.log(value);
        var _a = value.split(":"), password = _a[0], email = _a[1];
        return new User(username, email, password);
    };
    User.prototype.setPassword = function (toSet) {
        // Hash and set password
        var hp = bcrypt.hash(toSet, 10);
        this.password = hp;
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    User.prototype.validatePassword = function (toValidate) {
        // return comparison with hashed password
        return bcrypt.compare(this.password, toValidate) == toValidate;
    };
    return User;
}());
exports.User = User;
var UserHandler = /** @class */ (function () {
    function UserHandler(path) {
        this.db = leveldb_1.LevelDB.open(path);
    }
    UserHandler.prototype.get = function (username, callback) {
        this.db.get("user:" + username, function (err, data) {
            if (err)
                callback(err);
            else if (data === undefined)
                callback(null, data);
            callback(null, User.fromDb(username, data));
        });
    };
    UserHandler.prototype.save = function (user, callback) {
        this.db.put("user:" + user.username, user.getPassword + ":" + user.email, function (err) {
            callback(err);
        });
    };
    UserHandler.prototype.delete = function (username, callback) {
        // TODO
        this.db.del("user:" + username, function (err) {
            callback(err);
        });
    };
    return UserHandler;
}());
exports.UserHandler = UserHandler;
