ProductsPages = new Meteor.Pagination(Products, {
	availableSettings: {
        settings: true,
        sort: true,
        perPage:true
    },
    filters : {availability: {$eq: 1}},
    itemTemplate: "product",
    templateName: "allProducts",
    perPage: 12
});

ProductsPages.set({
  		"sort": {
    		name: -1
  		}
});

Template.allProducts.helpers({
	settings : function() {
      return {
        //isOpen : true
      };
    },
    options: function () {
      var tags = Tags.find().fetch();
      console.log(tags);
      return _.map(tags, function(tag){
      	console.log("map "+tag);
        return {label : tag.tag , value : tag.tag};
      });
    }
});

Template.allProducts.events({
  'click .search': function(){
    console.log("click");
    var sortPrice = document.getElementsByTagName("sortPrice");
    console.log("sortPrice:"+$('input[name="sortPrice"]:checked').val());
    return Pages.set("perPage", 3);
  }
});
