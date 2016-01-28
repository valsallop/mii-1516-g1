// "use strict";
// describe("Backend AcmeSupermarket Testing", function() {
//     it("should setup MongoDB for testing", function () {
//         Meteor.call('clearDB', function(){
//             Meteor.call('loadFixtures');
//         });
//     });
    
//     it("should be able to register as customer", function () {
//         spyOn(Meteor.users, "insert");
//         Accounts.createUser({email: 'test@test.com',password: '123456'});
//         expect(Meteor.users.insert).toHaveBeenCalled();
//     });
// });