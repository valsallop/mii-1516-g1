var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe('Get trending af a given product.', function () {
	it('should get trending serie of a given product between dates', function () {
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
			assert(res.body.trending.length > 0);
			for (var i = 0; i < res.body.trending.length; i++) {
				res.body.trending[i].should.have.property('ts');
				res.body.trending[i].should.have.property('mentions');
				assert(res.body.trending[i].mentions > 0);
			}
		});
	});
});
