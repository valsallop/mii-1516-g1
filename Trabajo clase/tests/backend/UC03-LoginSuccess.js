var request = require('supertest');
var should = require('should');
var assert = require('assert');


describe('Login success', function () {
	it('should get a 302', function (){
		request ('http://localhost:5000')
      .post( "/api/authenticate" )
      .send( {"email":"test","password":"test"} )
      .end(function(err,res){
			res.status.should.be.equal(302);
		});
	});
	
});