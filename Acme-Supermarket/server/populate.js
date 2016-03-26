function createUsers(){
	var idUsers = [];

	for (var i = 0; i<10;i++){
		var email = "customer"+i+"@customer"+i+".com";
		var pass = "customer"+i;
		Accounts.createUser({email: email,password: pass});
		var user= Meteor.users.findOne({"emails.address":email});
		idUsers.push(user._id);
	}
	return idUsers;
}

function createRatings(){
	var users = createUsers();
	var codes = [];
	for (var j = 1; j<300;j++){
		codes.push(j);
	}
	for (var x = 0; x<users.length;x++){
		var productPosibles = codes.slice();//copia de codes
		for (var i = 0; i<100; i++){
			//elegimos un producto aleatorio y que no se repita
			var aleatorio = Math.floor(Math.random()*(productPosibles.length)); 
			var codigo = productPosibles[aleatorio];
			productPosibles.splice(aleatorio, 1);

			//asignamos un rating
			var valorRating = Math.floor((Math.random()*5)+1);

			var idProduct = Products.find({code:codigo}).fetch()[0]._id._str;
			Ratings.insert({userId:users[x],proId:idProduct,rating:valorRating});
		}
	}
}

function createShoppingCarts(){
	var users = createUsers();
	var codes = [];
	for (var j = 1; j<300;j++){
		codes.push(j);
	}
	for(var y= 0; y<users.length; y++){
		for(var x = 0; x<10; x++){
			var copyCodes = codes.slice();//copia de codes
			var tamCart = Math.floor((Math.random()*6)+1);
			var items = [];
			for (var i = 0; i < tamCart; i++) {
				var aleatorio = Math.floor(Math.random()*(copyCodes.length)); 
				var codigo = copyCodes[aleatorio];
				copyCodes.splice(aleatorio, 1);
				var product = {"productCode":codigo,"amount":1};
				items.push(product);
			}

			ShoppingCarts.insert({
		        "userId" : users[y],
		        "items" : items,
		        "active" : false,
		        "deliveryDate" : new Date(),
		        "paymentDate" : new Date(),
		        "userName":"Customer customer",
		        "deliveryAddress":"Reina Mecedes, 45, 41012"
		    });
		}
			

	}
	
}
//createRatings();
//createShoppingCarts();