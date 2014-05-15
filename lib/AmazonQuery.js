var
CryptoJS = require('crypto-js'),
_        = require('underscore');

var
AWSAccessKey,
AWSAssociateKey,
AWSSecretKey,
defaultEndPoint      = 'webservices.amazon.com',
defaultService       = 'AWSECommerceService',
defaultReqUri        = '/onca/xml',
defaultSearchIndex   = 'Shoes',
defaultCondition     = 'All',
defaultOperation     = 'ItemSearch',
defaultResponseGroup = 'Images,ItemAttributes',
defaultIdType        = 'ASIN',
requestMethod        = 'GET';


var AmazonQuery          = function(AWSKey, AWSPass) {
  this.__AWSKey          = AWSKey;
  this.__AWSPass         = AWSPass;
}

AmazonQuery.prototype.requestForQuery = function(options){
    return this.buildURI(options);
}

AmazonQuery.prototype.buildURI = function(options) {
  var params      = this.buildParams(options);
  var canocParams = this.canocalizedParams(params);
  var sig         = this.buildSignature(canocParams);
  return this.buildRequestString(canocParams, sig);
};

AmazonQuery.prototype.buildRequestString = function(params, sig) {
  return  'http://' +
          defaultEndPoint +
          defaultReqUri + 
          '?' + params +
          '&Signature=' + sig;
}

// Signing request
AmazonQuery.prototype.buildSignature = function(canonicalParams) {
  var signStr = requestMethod   + "\n" +
                defaultEndPoint + "\n" +
                defaultReqUri   + "\n" +
                canonicalParams;   
  rawHMAC     = CryptoJS.HmacSHA256(signStr, this.__AWSPass);
  HMAC64      = rawHMAC.toString(CryptoJS.enc.Base64)
  return this.percentEncodeRfc3986(HMAC64); 
}

AmazonQuery.prototype.buildParams = function(options) {
  var params = {
    Service         : defaultService,
    Operation       : defaultOperation,
    ResponseGroup   : defaultResponseGroup,
    Condition       : defaultCondition,
    AWSAccessKeyId  : this.__AWSKey,
    AssociateTag    : this.__AWSAccociateKey,
    SearchIndex     : defaultSearchIndex,
    Timestamp       : this.ISODateString(new Date())
  };
  
  if (options.brand) params.Brand       = options.brand;
  if (options.Title) params.Title       = options.Title;
  // if (options.gender) params.Keywords   = options.gender;
  params.ItemPage                       = options.page ? options.page : "1";    

  return params;
}

AmazonQuery.prototype.ISODateString = function(date){
    function pad(n){return n < 10 ? '0' + n : n}
    return date.getUTCFullYear() + '-'
        + pad(date.getUTCMonth() + 1) + '-'
        + pad(date.getUTCDate()) + 'T'
        + pad(date.getUTCHours()) + ':'
        + pad(date.getUTCMinutes()) + ':'
        + pad(date.getUTCSeconds()) + 'Z'
}

AmazonQuery.prototype.zeroPad = function(num, length) {
  num = num + '';
  while (num.length < length) {
    num = '0' + num;
  }
  return num;
};

AmazonQuery.prototype.percentEncodeRfc3986 = function(str) {
  var tmp = encodeURIComponent(str);
  tmp = tmp.replace("+","%20");
  tmp = tmp.replace("*", "%2A");
  tmp = tmp.replace("%7E", "~");
  tmp = tmp.replace('!','%21');
  tmp = tmp.replace('*','%2A');
  tmp = tmp.replace('(','%28');
  tmp = tmp.replace(')','%29');
  tmp = tmp.replace("'",'%27');
  return tmp;
};

AmazonQuery.prototype.canocalizedParams = function(params) {  
  self = this;
  parts = _.map(params, function(v, k) {
    return self.percentEncodeRfc3986(k) + '=' + self.percentEncodeRfc3986(v)
  });    
  return parts.sort().join("&");
};


module.exports = exports = AmazonQuery;
