var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

// See http://mongoosejs.com/docs/schematypes.html
var userSchema =  new Schema({
	displayName: String,
	handle: {type:String,unique:true},
	provider: {type:String, required:true, enum:'facebook twitter'.split(' ')},
	twitterId: {type:String, sparse: true},
 	facebookId: {type:String, sparse: true},
	photo: String,
	modules: [{type:Schema.ObjectId, ref:'Module'}], // what modules have they created
	tags: [{type:Schema.ObjectId, ref:'Tag'}], // what tags have they added
  dateAdded: {type: Date, default: moment}
})

var User = mongoose.model('User', userSchema);

var moduleSchema = new Schema({
	tags: [String],
	url: {type:String, required:true}, // will be a link to a URL
	title: String,
	photo: String,
	isFeatured: {type: Boolean, default: false},
	//createdBy: {type:Schema.ObjectId, ref:'User'},
	dateAdded: {type: Date, default: moment}
})

var Module = mongoose.model('Module', moduleSchema);

var tagSchema = new Schema({
	name: {type:String, required:true},
	slug: {type:String, required:true, unique:true},
	modules: [{type:Schema.ObjectId, ref:'Module'}], // what modules does the tag have
	isFeatured: {type: Boolean, default: false},
	//createdBy: {type:Schema.ObjectId, ref:'User'},	
	dateAdded: {type: Date, default: moment}
})

var Tag = mongoose.model('Tag', tagSchema);

// Export Models
module.exports = {
  Module: Module,
  Tag: Tag,
  User: User
}