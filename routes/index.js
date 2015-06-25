
/*
 * routes/index.js
 * 
 * Routes contains the functions (callbacks) associated with request urls.
 */

// our db model
var db = require("../models/model.js");

// utility functions
var Utils = require('./utils.js'); // helper functions

//requires
var MetaInspector = require('node-metainspector');
/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */

exports.index = function(req, res) {
	
	console.log("main route requested");

	var data = {
		status: 'OK',
		message: 'itp-knowledge-base-api'
	}

	// respond back with the data
	res.json(data);

}

/**
 * POST '/api/create'
 * Receives a POST request of the new module, saves to db, responds back
 * @param  {Object} req. An object containing the different attributes of the Module
 * @return {Object} JSON
 */

exports.createModule = function(req,res){

	console.log(req.body);

	// 1) first need to check it's a valid url with regex
	var urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
	if(!urlRegEx.test(req.body.url)){
		var jsonData = {status:'ERROR', message: 'Not a valid url'};
		return res.json(jsonData);
	} 

	// 2) now need to get the meta information about the URL
	// see https://github.com/gabceb/node-metainspector
	var client = new MetaInspector(req.body.url, {});

	// gets the metadata from the URL
	client.on("fetch", function(){

	    var newModule = {
	    	url: req.body.url,
	    	tags: req.body.tags.split(","),
	    }

	    if(client.image) newModule['photo'] = client.image;
	    if(client.title) newModule['title'] = client.title;

	    // create the db instance out of the above object
		  var module = db.Module(newModule);	

		  // now, save that module to the database
			// mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save	  
		  module.save(function(err,data){
		  	// if err saving, respond back with error
		  	if (err){
		  		var jsonData = {status:'ERROR', message: 'Error saving module'};
		  		return res.json(jsonData);
		  	}

		  	console.log('saved a new module!');
		  	console.log(data);

		  	// now return the json data of the new person
		  	var jsonData = {
		  		status: 'OK',
		  		module: data
		  	}

		  	// function to find and update tags
		  	updateTags(data.tags,data._id);
		  	return res.json(jsonData);

		  })

	});

	client.on("error", function(err){
	    console.log(err);
	    var jsonData = {
	    	status: 'ERROR',
	    	message: 'We could not process that url'
	    }
	    return res.json(jsonData);
	});

	client.fetch();


	// function to add or update the tags
	 /* @param  tags - an array of tags
	 *  @param  id - the module id to associate with the tags
	 *  for all the tags the user has associated with the module
	 *  sees if the tag exists; if it does exist, adds the moduleId to the array of modules	for that tag	
	 *	if the tag does not exist, adds the tag and adds the moduleId as the first entry to the module array
	 */ 

	function updateTags(tags,moduleId){
		tags.forEach(function(e){
			var tagSlug = Utils.slugify(e);
			var tagName = e;
			db.Tag.findOneAndUpdate({slug:tagSlug},{name:e,$push: {"modules":moduleId}},{safe: true, upsert: true}, function(err,data){
				if(err) console.log(err);
				if(data) console.log(data);
			})
		})
	}

}

/**
 * GET '/api/get/modules'
 * Receives a GET request to get all modules
 * @return {Object} JSON
 */

exports.getAllModules = function(req,res){

	db.Module.find(function(err, data){
		// if err or no modules found, respond with error 
		if(err || data == null){
  		var jsonData = {status:'ERROR', message: 'Could not find any modules'};
  		return res.json(jsonData);
  	}

  	// otherwise, respond with the data	

  	var jsonData = {
  		status: 'OK',
  		modules: data
  	}	

  	res.json(jsonData);

	})

}

/**
 * GET '/api/get/module/:id'
 * Receives a GET request specifying the module to get
 * @param  {String} req.param('id'). The moduleId
 * @return {Object} JSON
 */

exports.getOneModule = function(req,res){

	var requestedId = req.param('id');

	db.Module.findById(requestedId, function(err,data){

		// if err or no module found, respond with error 
		if(err || data == null){
  		var jsonData = {status:'ERROR', message: 'Could not find that module'};
  		 return res.json(jsonData);
  	}

  	// otherwise respond with JSON data of the user
  	var jsonData = {
  		status: 'OK',
  		module: data
  	}

  	return res.json(jsonData);
	
	})
}

/**
 * GET '/api/get/tags'
 * Receives a GET request to get all modules
 * @return {Object} JSON
 */

exports.getAllTags = function(req,res){

	db.Tag.find().populate('modules').exec(function(err, data){
		// if err or no tags found, respond with error 
		if(err || data == null){
  		var jsonData = {status:'ERROR', message: 'Could not find any tags'};
  		return res.json(jsonData);
  	}

  	// otherwise, respond with the data	

  	var jsonData = {
  		status: 'OK',
  		tags: data
  	}	

  	res.json(jsonData);

	})

}

/**
 * GET '/api/get/tag/:name'
 * Receives a GET request specifying the name to get
 * @param  {String} req.param('name'). The tag name
 * @return {Object} JSON
 */

exports.getOneTag = function(req,res){

	var requestedSlug = req.param('slug');

	db.Tag.findOne({slug:requestedSlug}).populate('modules').exec(function(err, data){

		// if err or no tag found, respond with error 
		if(err || data == null){
  		var jsonData = {status:'ERROR', message: 'Could not find that tag'};
  		 return res.json(jsonData);
  	}

  	// otherwise respond with JSON data of the user
  	var jsonData = {
  		status: 'OK',
  		tag: data
  	}

  	return res.json(jsonData);
	
	})
}

/**
 * POST '/api/update/:id'
 * Receives a POST request with data of the user to update, updates db, responds back
 * @param  {String} req.param('id'). The userId to update
 * @param  {Object} req. An object containing the different attributes of the Person
 * @return {Object} JSON
 */

exports.update = function(req,res){

	var requestedId = req.param('id');

	// pull out the name and location
	var name = req.body.name;
	var location = req.body.location;

	//now, geocode that location
	geocoder.geocode(location, function ( err, data ) {

		console.log(data);
  	
  	// if we get an error, or don't have any results, respond back with error
  	if (err || data.status == 'ZERO_RESULTS'){
  		var jsonData = {status:'ERROR', message: 'Error finding location'};
  		res.json(jsonData);
  	}

  	// otherwise, update the user

	  var locationName = data.results[0].formatted_address; // the location name
	  var lon = data.results[0].geometry.location.lng;
		var lat = data.results[0].geometry.location.lat;
  	
  	// need to put the geo co-ordinates in a lng-lat array for saving
  	var lnglat_array = [lon,lat];

	  var dataToUpdate = {
	  	name: name,
	  	locationName: locationName,
	  	locationGeo: lnglat_array
	  };

	  // now, update that person
		// mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate  
	  Person.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
	  	// if err saving, respond back with error
	  	if (err){
	  		var jsonData = {status:'ERROR', message: 'Error updating person'};
	  		return res.json(jsonData);
	  	}

	  	console.log('updated the person!');
	  	console.log(data);

	  	// now return the json data of the new person
	  	var jsonData = {
	  		status: 'OK',
	  		person: data
	  	}

	  	return res.json(jsonData);

	  })

	});

}

/**
 * GET '/api/delete/:id'
 * Receives a GET request specifying the user to delete
 * @param  {String} req.param('id'). The userId
 * @return {Object} JSON
 */

exports.remove = function(req,res){

	var requestedId = req.param('id');

	// Mongoose method, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
	Person.findByIdAndRemove(requestedId,function(err, data){
		if(err || data == null){
  		var jsonData = {status:'ERROR', message: 'Could not find that person to delete'};
  		return res.json(jsonData);
		}

		// otherwise, respond back with success
		var jsonData = {
			status: 'OK',
			message: 'Successfully deleted id ' + requestedId
		}

		res.json(jsonData);

	})

}