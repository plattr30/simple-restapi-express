var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/test', { useMongoClient: true} ,function(error) {
	if (error) {
		console.log(error);
	}
});

var UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String
});

var User = mongoose.model('users', UserSchema);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//
// GET /users - Get all users
//
app.get('/users', function(req,res) {
    User.find({}, function (err, docs) {
        res.json(docs);
    });
});

//
// POST /users - Create a new user
//
app.post('/users', function(req,res) {
    User({ first_name : req.body.first_name, last_name : req.body.last_name, email : req.body.email}).save();
    res.sendStatus(201);
});

//
//GET /users/:id- Get a single user by id
//
app.get('/users/:id', function(req,res) {
    User.findById(req.params.id, function (err, user) {
	if (user) {
            res.json(user);
	} else {
	    res.send("No user found with that ID");
	};
    });
});


//
//PUT /users/:id - Update a user
//
app.put('/users/:id', function(req,res) {
    User.findById(req.params.id, function (err, user) {
	if ( req.body.first_name ) { user.first_name = req.body.first_name };
	if ( req.body.last_name ) { user.last_name = req.body.last_name };
	if ( req.body.email ) { user.email = req.body.email};
	user.save();
	res.sendStatus(200);
    });
});

//
//DELETE /users/:id - Delete a user
//
app.delete('/users/:id', function(req,res) {
    User.remove({ _id: req.params.id}, function(err) {
        res.sendStatus(200);
    });
});

app.listen(3000);

