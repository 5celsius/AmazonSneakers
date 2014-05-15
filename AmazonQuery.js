var
request = require('request'),
amznReq = require('./AmazonSneakers'),
xmlParser = require('xml2js'),
parser = xmlParser.Parser();

function shoeRequest(queryStr, options, cb) {
  if (typeof queryStr === 'undefined') throw new Error('undefined is not a valid search text')
  if (typeof options === 'function' && !cb) {
    cb = options;
    options = {};
  }

  options.searchString = queryStr;
  var requestStr   = amznReq.ShoeSearchRequest(options);

  request(requestStr, function(err, res, body) {
    if(!err && res.statusCode == 200) {
        parser.parseString(body);
    } else {
        cb('Invalid Response from Server')
    }
  });

  parser.addListener('end', function (result) {
    var jsonStr = JSON.stringify(result);
    parseResults(result, cb);
    console.log(result);
    cb(null, result);
  });
}

var parseResults = function(results, cb) {
  var searchResponse = results.ItemSearchResponse;
  var items = searchResponse.Items;
  var products = items[0];
  var results = products.Item.map(function(shoeInfo){
  var shoeObj = {};
  var shoeAttrs   = shoeInfo.ItemAttributes[0];
  var imageSets   = shoeInfo.ImageSets[0];
  var imageSet    = imageSets.ImageSet;
  var imageObj    = imageSet[0];
  var mediumImage = imageObj.MediumImage[0];
  shoeObj.ASIN    = shoeInfo.ASIN[0];
  shoeObj.title   = shoeAttrs.Title[0];
  shoeObj.brand   = shoeAttrs.Brand[0];
  shoeObj.image   = mediumImage.URL[0];
  return shoeObj;
  });
  cb(null, results);
}

exports.shoeRequest = shoeRequest;