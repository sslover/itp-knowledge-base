var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
	tag: {type:String, required:true},
	title: String,
	data: {type:String, required:true}, // will be a link to a URL
	createdBy: {type:Schema.ObjectId, ref:'User'},
	dateAdded: {type: Date, default: moment}
})

var Module = mongoose.model('Module', moduleSchema);

var tagSchema = new Schema({
	name: {type:String, required:true},
	modules: [{type:Schema.ObjectId, ref:'Module'}], // what modules does the tag have
	createdBy: {type:Schema.ObjectId, ref:'User'},	
	dateAdded: {type: Date, default: moment}
})

var Module = mongoose.model('Module', moduleSchema);

// Export Models
module.exports = {
  Module: Module,
  Tag: Tag,
  User: User
}