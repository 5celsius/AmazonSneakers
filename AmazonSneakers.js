var
CryptoJS = require('crypto-js'),
_        = require('underscore');

var
defaultEndPoint      = 'webservices.amazon.com',
defaultService       = 'AWSECommerceService',
defaultReqUri        = '/onca/xml',
defaultSearchIndex   = 'Shoes',
defaultCondition     = 'All',
defaultOperation     = 'ItemSearch',
defaultResponseGroup = 'Images,ItemAttributes',
defaultIdType        = 'ASIN',
requestMethod        = 'GET';

// Exports

var ShoeSearchRequest = function(options){
    return buildURI(options);
}

exports.ShoeSearchRequest = ShoeSearchRequest;

function buildURI(options) {
	var params      = buildParams(options);
	var canocParams = canocalizedParams(params);
	var sig         = buildSignature(canocParams);
	return buildRequestString(canocParams, sig);
};

function buildRequestString(params, sig) {
	return 	'http://' +
					defaultEndPoint +
					defaultReqUri +
					'?' +
					params +
					'&Signature=' +
					sig;
}

// Signing request
function buildSignature(canonicalParams) {
	var signStr = requestMethod + "\n" +
								defaultEndPoint + "\n" +
								defaultReqUri + "\n" +
								canonicalParams;
	rawHMAC 		= CryptoJS.HmacSHA256(signStr, AWSSecretKey);
	HMAC64			= rawHMAC.toString(CryptoJS.enc.Base64)
	return percentEncodeRfc3986(HMAC64);
}

function buildParams(options) {
	var params = {
		Service 				: defaultService,
		Operation 			: defaultOperation,
		ResponseGroup 	: defaultResponseGroup,
		Condition       : defaultCondition,
		AWSAccessKeyId	: AWSAccessKey,
		AssociateTag		: AWSAssociateKey,
    SearchIndex     : defaultSearchIndex,
		Timestamp 			: ISODateString(new Date())
	};
		if (options.searchText) params.Title  = options.searchString;
		if (options.brand) params.Brand       = options.brand;
		if (options.gender) params.Department = options.gender;
		params.ItemPage                       = options.page ? options.page : "1";
    return params;
}

function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
        + pad(d.getUTCMonth()+1)+'-'
        + pad(d.getUTCDate())+'T'
        + pad(d.getUTCHours())+':'
        + pad(d.getUTCMinutes())+':'
        + pad(d.getUTCSeconds())+'Z'
}

function zeroPad(num, length) {
  num = num + '';
  while (num.length < length) {
    num = '0' + num;
  }
  return num;
};

function canocalizedParams(params) {	
	parts = _.map(params, function(v, k) {
		return percentEncodeRfc3986(k) + '=' + percentEncodeRfc3986(v)
	});
	return parts.sort().join("&");
};

function percentEncodeRfc3986(str) {
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
