// describe("E2E - Nominal - Add product to cart", function() {
//     beforeEach(function() {
//         Meteor.loginWithPassword('test@test.com', '123456', function (err) {
//             expect(err).toBeUndefined();
//             done();
//         });
//     });

//     it("setup test case", function () {
//         Meteor.call('clearDB', function(){
//             Meteor.call('loadFixtures');
//         });
//         Accounts.createUser({email: 'test@test.com',password: '123456'});
//         Router.go('/product/1');
//         expect($("#name")).toBeDefined();
//         expect($("#description")).toBeDefined();
//         expect($("#cost")).toBeDefined();
//         expect($(".idAddCart")).toBeDefined();
//     });

//     it("login", function (done) {
//         Meteor.loginWithPassword('test@test.com', '123456', function (err) {
//             expect(err).toBeUndefined();
//             done();
//         });
//     });

//     it("update profile", function (done) {
//         spyOn(Meteor.users, "update");
//         Meteor.users.update(Meteor.userId(), {
//           $set: { name: "Test",
//             surname: "Test",
//             address:{name: "calle casalarreina",number:"8",postalCode:"11520"},
//             creditCard:{number:"123456",CVV:555,expMonth:10,expYear:2020}
//         });
//         expect(Meteor.users.update).toHaveBeenCalled();
//         expect(Meteor.user().name).toBe("Test");
//     });

//     it("check loggedUser", function (done) {
//         var id= Meteor.userId();
//         if(id!=null){
//             if(Meteor.user().emails[0].address=='test@test.com'){
//                 done();
//             }
//             else{
//                 throw new Error('Another user is logged in');
//             }
//         }
//         throw new Error('No user logged in');
//     });

//     it("addToCart", function () {
//         $(".idAddCart").click();
//         spyOn(ShoppingCarts,"update");
//         expect(ShoppingCarts.update).toHaveBeenCalled();
//             // var cart=ShoppingCarts.findOne({ active:true , userId:Meteor.userId()});
//             // for (var i = 0; i < cart.items.length; i++) {
//             //   var exist=false;
//             //   if(cart.items[i].productCode==1){
//             //     exist=true;
//             //     break;
//             //   }
//             // }
//             // if(!exist){
//             //     throw new Error('Item not in cart');
//             // }
//             // Router.go('/shoppingCart');

//         });

//     it("tear down", function (done) {
//         Meteor.logout(function (err) {
//             expect(err).toBeUndefined();
//             if(Meteor.userId()==null){
//                 done();
//             }else{
//                 throw new Error('User keeps logged in');
//             }
//         });
//     });
// });