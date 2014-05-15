var
request         = require('request'),
awsQueryBuilder = require('./AmazonQuery'),
xmlParser       = require('xml2js'),
parser          = xmlParser.Parser();

var AmazonSneakers = function(AWSKey, AWSPass) {
	
	if (!(this instanceof AmazonSneakers)) {
    return new AmazonSneakers(AWSKey, AWSPass);
  }

	this.__AWSQueryBuilder = new awsQueryBuilder(AWSKey, AWSPass);	
};

AmazonSneakers.prototype.query = function(queryStr, options, cb) {
  if (typeof queryStr === 'undefined') throw new Error('undefined is not a valid search text')
  if (typeof options === 'function' && !cb) {
    cb = options;
    options = {};
  }

	options.searchString = queryStr;

	var requestStr       = this.__AWSQueryBuilder.requestForQuery(options);

  parser.addListener('end', function (result) {
    var jsonStr = JSON.stringify(result);    
    parsedResults = parseResults(result);        
    cb(null, parsedResults);
  });

  request(requestStr, function(err, res, body) {
    if(!err && res.statusCode == 200) {
        parser.parseString(body);        
    } else {
        cb('Invalid Response from Server')
    }
  });
}


var parseResults = function(results) {	
	var searchResponse = results.ItemSearchResponse;
	var items          = searchResponse.Items;	
	var products       = items[0];
	console.log(products)
	var results        = products.Item.map(function(shoeInfo){
		var shoeObj        = {};
		var shoeAttrs      = shoeInfo.ItemAttributes[0];
		var imageSets      = shoeInfo.ImageSets[0];
		var imageSet       = imageSets.ImageSet;
		var imageObj       = imageSet[0];
		var mediumImage    = imageObj.MediumImage[0];
		shoeObj.ASIN       = shoeInfo.ASIN[0];
		shoeObj.title      = shoeAttrs.Title[0];
		shoeObj.brand      = shoeAttrs.Brand[0];
		shoeObj.image      = mediumImage.URL[0];
	  return shoeObj;
  });
  return results;
}

module.exports = exports = AmazonSneakers;