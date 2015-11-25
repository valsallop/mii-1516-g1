var request = require('supertest');
var should = require('should');
var assert = require('assert');

describe('Get to find 14 recommendations', function(){
	it('should get 14 recommendations', function(){
		request('http://localhost:8080')
		.get('/api/recommended')
		.send()
		.end(function(err,res){
			res.status.should.be.equal(200);
			assert(res.body.length == 10);
			//console.log(res.body.length);
		});
	});
});