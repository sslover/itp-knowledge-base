var fs = require('fs');

/**
 * Utility defining set of helper functions
 */

/**
 * Will contain all the helper methods
 * @type {Object}
 */
var utils = {};

 /**
   * Takes a comma separated string, splits it, and makes an array
   * @param  {String} A comma separated string - example "foo,foo,foo,foo"
   * @return {Array} example - ["foo","foo","foo","foo"];
   */

	utils.arrayify = function(str){
	  if (str == null || str == "") return new Array(); // return empty array
	  else return str.split("|");
	}

  utils.removeFromArray = function(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

 /**
   * Takes a string, trims/cleans it, removes spaces, makes lower case, and returns a sluggified string
   * @param  {String} Original string - example "Foo Bar Foo's Bar"
   * @return {String} Sluggified string - example "foo-bar-foos-bar"
   */

	utils.slugify = function(str){
	  str = str.replace(/^\s+|\s+$/g, ''); // trim
	  str = str.toLowerCase();
	  
	  // remove accents, swap ñ for n, etc
	  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
	  var to   = "aaaaeeeeiiiioooouuuunc------";
	  for (var i=0, l=from.length ; i<l ; i++) {
	    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	  }

	  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
	    .replace(/\s+/g, '-') // collapse whitespace and replace by -
	    .replace(/-+/g, '-'); // collapse dashes

	  return str;  
	}

	 utils.checkIfPresent = function(str){
		if (str) return true;
	    else return false;
	}

  utils.cleanFileName = function(filename) {
      
      // cleans and generates new filename for example userID=abc123 and filename="My Pet Dog.jpg"
      // will return "abc123_my_pet_dog.jpg"
      var fileParts = filename.split(".");
      
      //get the file extension
      var fileExtension = fileParts[fileParts.length-1]; //get last part of file
      
      //add time string to make filename a little more random
      d = new Date();
      timeStr = d.getTime();
      
      //name without extension
      newFileName = fileParts[0];
      
      return newFilename = timeStr + "_" + fileParts[0].toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_') + "." + fileExtension;
      
  }

  // sort array of objects by whatever property we pass in 
  utils.dynamicSort = function (property) {
    var sortOrder = 1;
    if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a,b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }  

  // takes an array, randomly shuffles it, and returns shuffled array
  utils.shuffle = function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }  



  utils.getRandomNum = function(min,max){
    return Math.round(Math.random() * (max - min) + min);
  }

  //handle duplicates error handler
  utils.handleDuplicateError = function(req,res,err,key,redirectUrl){
    if(err.code!=11000){
      console.log("** We have an error **");
      console.log(err);
      return res.redirect('/404');     
    }
      console.log("** We have a duplicate key error **");
      console.log(err);
      return res.redirect(redirectUrl);  
  } 

  // sees if a string exists in an array
  // if so, returns true, else returns false
  utils.contains = function(str,arr) {
    for (var i = 0; i < arr.length; i++) {
      if (String(arr[i]) === String(str)) {
        return true;
      }
    }
    return false;
  } 
     
  //simple error handler for now
  utils.errorHandler = function(res,err){
    console.log("** We have an error **");
    console.log(err);
    return res.redirect('/404');
  }

  module.exports = utils;