var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var app = express();
var router = express.Router();
var db;
var jsonParser = bodyParser.json();

var Schema = mongoose.Schema;

var NewUser = new Schema({
	firstName: String,
	lastName: String
})

// var schema = new mongoose.Schema({name: 'string'})

var User = mongoose.model('User', NewUser);

mongoose.connect("mongodb://User1:User1@ds145019.mlab.com:45019/node-capstone")

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json());

app.get("/getUsers", function(req, res) {
	User.find(function(err, users){
		if(err)
			res.send(err);
		res.json(users);
	})
})

app.post('/newUser', function(req, res){
	const requiredFields = ['firstName', 'lastName'];
	for (var i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = 'Missing \`${field}\` in request body'
			return res.status(400).send(message);
		}
	}
	thisUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    thisUser.save(function(err) {
        if (err)
            res.send(err);
        res.redirect('/');
    });
});

app.put('/updateTenant/:id', function(req, res) {
	// const requiredFields = ['firstName', 'lastName'];
	// for (var i=0; i<requiredFields.length; i++) {
	// 	const field = requireFields[i];
	// 	if (!(field in req.body)) {
	// 		const message = `Missing \`${field}\` in request body`
	// 		console.error(message);
	// 		return res.status(400).send(message);
	// 	}
	// }
	// if (req.params.id !== req.body.id) {
	// 	const message = (
	// 		`Request path id (${req.params.id}) and request body id `
	// 		`(${req.body.id}) must match`);
	// 	console.error(message);
	// 	return res.status(400).send(message);
	// }
	// var updatedUser = User.update({
	// 	id: req.body.id,
	// 	lateFees: req.body.lateFees
	// });
	// res.status(204).json(updatedUser);
	var queryId = {
		_id: req.params.id
	};
	var newTenant = req.body;
	console.log(newTenant);
	User.findOneAndUpdate(newTenant, newTenant, function(err, user) {
		if (err) {
			return res.status(500);
		}
		res.status(201).json({
			message: 'tenant updated'
		})
	});
});

app.delete('/deleteUser/:id', function(req, res) {
	console.log(req.params.id);
	User.findByIdAndRemove(req.params.id, function(err, User) {
	if (err) {
	console.log("error message")
	return res.status(500).json({message: 'Internal Server Error'}); }
	res.status(201).json({ message: 'Item was deleted' })
	})
	// newUser.delete(req.params.id);
	// console.log('Deleting user \`${req.params.id}\`');
	// res.status(204).end();
});




app.listen(process.env.PORT || 8080);
console.log("listening on port 8080");