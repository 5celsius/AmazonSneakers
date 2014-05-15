var
should					= require('should'),
_ 							= require('underscore'),
ENV 						= require('./../.env'),
AmazonRequest 	= require('./../lib/AmazonSneakers')(ENV['AWS_KEY'], ENV['AWS_PASS']);

describe('Amazon Sneakers Test Suite', function () {
	// Set Longer Timeout for api calls
	this.timeout(6000);

	describe('Making a request to Amazon with only a query string', function () {	
		it('should return a list of shoes', function (done) {
			AmazonRequest.query('nike', function(err, results){						
				_.isArray(results).should.be.ok;
				done(err, results);			
			});		
		});

		it('should return an empty array for a empty string query', function (done) {
			AmazonRequest.query('', function(err, results){												
				_.isArray(results).should.be.ok;			
				results.length.should.equal(0);			
				done(err, results);			
			});		
		});

		it('should return 10 entries for a generic text search', function (done) {
			AmazonRequest.query('brooks', function(err, results){														
				_.isArray(results).should.be.ok;
				results.length.should.equal(10);			
				done(err, results);
			});		
		});

		it('should return different results for different text searches', function (done) {
			// First Request
			AmazonRequest.query('brooks', function(err, results){														
				_.isArray(results).should.be.ok;
				results.length.should.equal(10);
				var previousTitle = _.last(results).Title;
				previousTitle.should.be.type('string');
				// Next Request
				AmazonRequest.query('Nike', function(err, results){														
					_.isArray(results).should.be.ok;
					results.length.should.equal(10);
					var nextTitle = _.last(results).Title;
					nextTitle.should.be.type('string');
					nextTitle.should.not.equal(previousTitle);
					done(err, results);
				});							
			});		
		});		
	});

	describe('Making a request with the query string + options', function () {
		it('should allow for a brand selection', function (done) {
			AmazonRequest.query('brooks', {brand: 'brooks'}, function(err, results){														
				_.isArray(results).should.be.ok;
				results.length.should.equal(10);			
				_.last(results).Brand.should.equal('Brooks');
				done(err, results);
			});		
		});

		it('should allow for a gender selection', function (done) {
			AmazonRequest.query('brooks', {gender: 'womens'}, function(err, results){																		
				_.isArray(results).should.be.ok;
				results.length.should.equal(10);											
				var lowCaseResult = _.last(results).Title.toLowerCase().contains('women\'s').should.be.ok;				
				done(err, results);
			});		
		});

		it('should allow for a gender selection', function (done) {
			AmazonRequest.query('brooks', function(err, results){														
				_.isArray(results).should.be.ok;
				results.length.should.equal(10);
				var previousTitle = _.last(results).Title;
				previousTitle.should.be.type('string');
				// Next Request
				AmazonRequest.query('brooks', { page: 2 }, function(err, results){														
					_.isArray(results).should.be.ok;
					results.length.should.equal(10);
					var nextTitle = _.last(results).Title;
					nextTitle.should.be.type('string');
					nextTitle.should.not.equal(previousTitle);
					done(err, results);
				});							
			});		
		});
	});

	describe('Not setting the credentials correctly', function () {

		it('should return an error on the query when the AWS Key is not set', function (done) {
			var AmazonReq = require('./../lib/AmazonSneakers')(null, ENV['AWS_PASS']);
			AmazonReq.query('brooks', { page: 2 }, function(err, results){														
				_.isString(err).should.be.true;
				done(null);
			});							
		});

		it('should return an error on the query when the AWS Pass is not set', function (done) {
			var AmazonReq = require('./../lib/AmazonSneakers')(ENV['AWS_KEY'], null);
			AmazonReq.query('brooks', { page: 2 }, function(err, results){														
				_.isString(err).should.be.true;
				done(null);
			});										
		});

		it('should return an error on the query when the AWS Key is an empty String', function (done) {
			var AmazonReq = require('./../lib/AmazonSneakers')('', ENV['AWS_PASS']);
			AmazonReq.query('brooks', { page: 2 }, function(err, results){														
				_.isString(err).should.be.true;
				done(null);
			});										
		});

		it('should return an error on the query when the AWS Pass is an empty String', function (done) {
			var AmazonReq = require('./../lib/AmazonSneakers')(ENV['AWS_KEY'], '');
			AmazonReq.query('brooks', { page: 2 }, function(err, results){														
				_.isString(err).should.be.true;
				done(null);
			});										
		});

	});

});

// String Prototype Additions
if (!String.prototype.contains ) {
  String.prototype.contains = function() {
    return String.prototype.indexOf.apply( this, arguments ) !== -1;
  };
}

