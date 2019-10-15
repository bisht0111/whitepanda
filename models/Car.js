
// Requiring mongoose variable which points to TodoApp DataBase
var {mongoose} = require('./mongoose.js');
// In mongoDB, we can have different documents with
// different fields/properties inside the same collection.
// To make things more organised, we create a model for
// everything we want to store.(which is the basic framework of
// for every document.
// The newly created object may or may not have these properties
// depending on how it is defined.
// However if defined, it should follow all the features,
// defined for it in the model.
// First argument is the name of model.
// The collection name using that model will be todos 
// Second arg is an object which defines various properties
// for the model.
// We define a text property/field and define it equal to a
// object which defines what text is.

var Car = mongoose.model('Car',{
	number: {
		type: Number,
		required: true,
		minlength: 4
	},
	isRented:{
		type: Boolean,
		default: false
	},
	user: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
    }
});

module.exports = {
	Car
}
