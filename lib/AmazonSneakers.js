var
request         = require('request'),
awsQueryBuilder = require('./AmazonQuery'),
xmlParser       = require('xml2js'),
_ 							= require('underscore')
parser          = xmlParser.Parser();

var AmazonSneakers = function(AWSKey, AWSPass) {
	
	if (!(this instanceof AmazonSneakers)) {
    return new AmazonSneakers(AWSKey, AWSPass);
  }

	this.__AWSQueryBuilder = new awsQueryBuilder(AWSKey, AWSPass);	
};

AmazonSneakers.prototype.query = function(queryStr, options, cb) {  
  if (typeof queryStr === 'undefined') return cb(new Error('undefined is not a valid search text'));
  if (typeof options === 'function' && !cb) {
    cb = options;
    options = {};
  }
  if (queryStr === '') return cb(null, []);	

	options.Title  = queryStr;
	var requestStr = this.__AWSQueryBuilder.requestForQuery(options);	
  
  request(requestStr, function(err, res, body) {
    if(!err && res.statusCode == 200) {
    	translateXML(body, cb);
    } else {
        cb('Invalid Response from Server')
    }
  });
}

var translateXML = function (body, cb) {
  parser.parseString(body, function(err, result){
		var jsonStr   = JSON.stringify(result);    
		parsedResults = parseResults(result);        
		cb(null, parsedResults);
  });        
}

var parseResults = function(results) {		
	var searchResponse = results.ItemSearchResponse;
	var items          = searchResponse.Items;	
	var products       = items[0];	
	var parsedResults  = [];
	// console.log(products.Request);
	if (Number(products.TotalResults[0])) {
		parsedResults        = products.Item.map(function(shoeInfo){						
			var shoeAttrs      = shoeInfo.ItemAttributes[0];
			var imageSets      = shoeInfo.ImageSets[0];
			var imageSet       = imageSets.ImageSet;
			var imageObj       = imageSet[0];
			var mediumImage    = imageObj.MediumImage[0];
			shoeObj						 = _.pick(shoeAttrs, 'Title', 'Brand')			
			shoeObj.ASIN       = shoeInfo.ASIN[0];			
			shoeObj.image      = mediumImage.URL[0];
		  return _.each(shoeObj, function(v, k){		  
		  	if (_.isArray(v)) { this[k] = _.last(v) };
		  }, shoeObj);		  
	  });
	};	
  return parsedResults;
}

module.exports = exports = AmazonSneakers;