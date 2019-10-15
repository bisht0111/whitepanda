var mongoose = require('mongoose');

// Mongoose prefers callbacks by default.
// We want to tell mongoose that we will use inbuilt promise library.
// as opposed to some 3rd party one.
mongoose.Promise = global.Promise;

// Mongoose also takes time to connect.
// So, if we write a query and query is executed before
// connection is made, mongoose will wait for the 
// connection before it tries to make the query.
mongoose.connect('mongodb://<bisht>:<bisht123>@ds121753.mlab.com:21753/carapp', { useNewUrlParser: true, useUnifiedTopology: true });
module.exports = {
	mongoose
}