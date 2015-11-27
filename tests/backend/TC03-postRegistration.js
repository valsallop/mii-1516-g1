var request = require('supertest');
var should = require('should');
var assert = require('assert');

/*
	Undo changes in DB 
		db.users.remove( { user_id: /^test/ } )
*/
describe('Insert a User', function () {
	var randSuf = Math.random();
	it('should get a 200', function (){
		request ('http://localhost:8080')
      .post( "/api/registration" )
      .send( {
		name : "testName" + randSuf,
		surname: "testSname" + randSuf,
		email: "mail@test.com" + randSuf,
		address: "testAddress" + randSuf,
		gps_coord: "testC00rD5" + randSuf,
		credit_card: "testCcnumber" + randSuf,
		password: "testPassword"
	} )
      .end(function(err,res){
			res.status.should.be.equal(200);
		});
	});
});

describe('Insert User without gps_coord', function () {
	var randSuf = Math.random();
	it('should get a 200', function (){
		request ('http://localhost:8080')
      .post( "/api/registration" )
      .send( {
		name : "testName" + randSuf,
		surname: "testSname" + randSuf,
		email: "mail@test.com" + randSuf,
		address: "testAddress" + randSuf,
		credit_card: "testCcnumber" + randSuf,
		password: "testPassword"
	} )
      .end(function(err,res){
			res.status.should.be.equal(200);
		});
	});
});


describe('Try insert a invalid User', function () {
	it('should get a 500', function (){
		request ('http://localhost:8080')
      .post( "/api/registration" )
      .send( {
		name : "",
		surname: "",
		email: "mail@test.com",
		address: "",
		gps_coord: "testC00rD5",
		credit_card: "testCcnumber",
		password: "testPassword"
	} )
      .end(function(err,res){
			res.status.should.be.equal(500);
		});
	});
});
/*describe('Try insert a duplicated User', function () {
	it('should get a 500', function (){
		request ('http://localhost:8080')
      .post( "/api/registration" )
      .send( {
		name : "testName",
		surname: "testSname",
		email: "mail@test.com",
		address: "testAddress",
		gps_coord: "testC00rD5",
		credit_card: "testCcnumber",
		password: "testPassword",
		admin: true
	} )
      .end(function(err,res){
			res.status.should.be.equal(500);
		});
	});
});*/