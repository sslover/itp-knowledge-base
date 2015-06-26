
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// the ExpressJS App
var app = express();

// configuration of expressjs settings for the web server.

// server port number
app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

// connecting to database
app.db = mongoose.connect(process.env.MONGOLAB_URI);
console.log("connected to database");

/**
 * CORS support for AJAX requests
 */

app.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

// api baseURI is at /api/

// API Routes 

// ROUTES, logic is in routes/index.js

var routes = require('./routes/index.js');

// home route gives API status
app.get('/', routes.index); // calls index function in /routes/index.js

// Module API routes
app.post('/api/create/module', routes.createModule);
app.get('/api/get/modules', routes.getAllModules);
app.get('/api/get/module/:id', routes.getOneModule); 
app.post('/api/update/module/:id', routes.updateModule);
app.get('/api/delete/module/:id', routes.removeModule); 

// TAG API routes
app.post('/api/create/tag', routes.createTag);
app.get('/api/get/tags', routes.getAllTags);
app.get('/api/get/tag/:slug', routes.getOneTag); 
app.get('/api/delete/tag/:slug', routes.removeTag); 
app.post('/api/update/tag/:slug', routes.updateTag);

// if route not found, respond with 404
app.use(function(req, res, next){

	var jsonData = {
		status: 'ERROR',
		message: 'Sorry, we cannot find the requested URI'
	}
	// set status as 404 and respond with data
  res.status(404).send(jsonData);

});

// create NodeJS HTTP server using 'app'
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});