var request = require('supertest');
var should = require('should');
var assert = require('assert');

var PROD_CODE = 1;

describe('Get all products from DB.', function () {
	it('should get a JSON containing all of products', function (){
		// Insert a contact
		request('http://localhost:4242/analytics')
		.post('/trending')
		.send( {
			code:"0",
			ts_init: "2016-01-01T00:00:00.000Z",
			ts_end: "2016-01-30T00:00:00.000Z"
		} ).end(function(err,res){
			assert(res != null);
			res.status.should.be.equal(200);
			res.body.should.have.property('code');
			res.body.should.have.property('trending');
			for (var i = 0; i < res.body.trending.length; i++) {
				res.body.trending[i].should.have.property('ts');
				res.body.trending[i].should.have.property('mentions');
				assert(res.body.trending[i].mentions > 0);
			}
		});
	});
});
