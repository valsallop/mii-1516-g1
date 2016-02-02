// "use strict";
// describe("Backend - Nominal - Register new user", function() {
//     it("setup MongoDB for testing", function () {
//         Meteor.call('clearDB', function(){
//             Meteor.call('loadFixtures');
//         });
//     });

//     it("register new customer", function () {
//         spyOn(Meteor.users, "insert");
//         Accounts.createUser({email: 'test@test.com',password: '123456'});
//         expect(Meteor.users.insert).toHaveBeenCalled();
//     });
// });