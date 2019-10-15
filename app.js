const express = require('express');
const bParser = require('body-parser');
const { mongoose } = require('./models/mongoose.js');
const { Car } = require('./models/Car.js');
const User = require('./models/user.js');
var app = express();
var port = process.env.PORT || 3000;
const passport = require("passport");
const localStrategy = require("passport-local");


// Content passed along with HTTP request in body property
// is parsed to JSOn so that it can be read by the server.
app.use(bParser.urlencoded({ extended: false }))
app.use(bParser.json());
app.use(require("express-session")(
	{
		secret: "I am a boy",
		resave: false,
		saveUninitialized: false
	}));
// Initiating passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Is logged in middleware
var isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

app.get('/cars', (req, res) => {
	Car.find().then((cars) => {
		// While passing an array, we cannot pass
		// other res properties like custom code
		// Better method is to pass an array
		// with todos array inside as key value pair
		res.send({ cars });
	}).catch((err) => {
		console.log('Error ');
		res.status(400).send(err);
	})
});

app.post('/cars', (req, res) => {
	console.log(req.body);
	// If an object failing the properties' conditions is defined
	// then new Todo() will not throw an error but, .save() will throw 
	// one
	var obj = {
		number: req.body.number,
		isRented: req.body.isRented
	}
	var car = new Car(obj);
	car.save().then((saved) => {
		res.send(saved);
	}).catch((e) => {
		res.status(400).send(e);
	})
});

// Renting a new Car
app.get("/cars/:id", isLoggedIn, (req, res) => {
	Car.findById(req.params.id).then((found) => {
		if (found.isRented) {
			res.send("Car already booked");
		}
		found.user.id = req.user._id;
		found.user.username = req.user.username;
		found.isRented = true;
		found.save();
		res.redirect('/cars');
	}).catch((e) => {
		res.status(400).send(e);
	})
})
// REGISTER LOGIC
app.get("/register", (req, res) => {
	res.send("Enter your username and passwod to register");
})
app.post("/register", function (req, res) {
	console.log(req.body);
	User.register(new User({ username: req.body.username }), req.body.password, function (err, created) {
		if (err) {
			res.send(err);
		}
		passport.authenticate("local")(req, res, function () {
			res.redirect("/cars");
		});
	});
});

//LOGIN FUNCTIONALITY
app.get("/login", (req, res) => {
	res.send("Sign Up | Login first");
})
app.post("/login", passport.authenticate("local", {
	successRedirect: "/cars",
	failureRedirect: "/login"
}
));
app.listen(port, () => {
	console.log(' Web Server running on port', port);
})
