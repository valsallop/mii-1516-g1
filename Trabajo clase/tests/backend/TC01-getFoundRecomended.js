var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe('Get to find 10 recommendations', function(){
	it('should get 10 recommendations', function(){
		request('http://localhost:8080')
		.get('/api/recommended')
		.send()
		.end(function(err,res){
			res.status.should.be.equal(200);
			assert(res.body.length > 0);
			//console.log(res.body.length);
		});
	});
});