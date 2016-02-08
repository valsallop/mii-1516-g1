ProductsPages = new Meteor.Pagination(Products, {
    itemTemplate: "product",
    templateName: "allProducts",
    perPage: 12
});

Template.allProducts.helpers({
  	tags: function() {
	  	var tags={};
	  	var products=Products.find().fetch();
	  	for (i = 0; i < products.length; i++) {
	  		for(j=0;j<products[i].tags;j++){
	  			console.log("tag:"+products[i].tags[j]);
	  			if(tags.indexOf(products[i].tags[j]==-1)){
	  				tags.push(products[i].tags[j]);
	  			}
	  		}
	   	}
	   	return tags;
	}, 
});
