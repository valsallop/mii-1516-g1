Template.orderHistory.helpers({
  order: function() {
  	var orders=ShoppingCarts.find({ active:false , userId:Meteor.userId()},{sort: {paymentDate: -1}}).fetch();
    return orders;
  }
});
Template.orderHistoryItem.helpers({
item: function() {
    var cart=ShoppingCarts.findOne({ active:false , userId:Meteor.userId(), _id:this.id});
    var items= cart.items;
    for (i = 0; i < items.length; i++) { 
     var dbItem=Products.findOne({code:parseInt(items[i].productCode)});
     items[i].name=dbItem.name;
     items[i].cost=dbItem.cost;
     items[i].image=dbItem.image;
     items[i].total=parseFloat(items[i].amount*items[i].cost).toFixed(2);;
   }
   return items;
 },
 totalCost: function() {
    var cart=ShoppingCarts.findOne({ active:false , userId:Meteor.userId(), _id:this.id});
    var items= cart.items;
    totalCost=0.0;
    for (i = 0; i < items.length; i++) { 
      var dbItem=Products.findOne({code:parseInt(items[i].productCode)});
      totalCost=totalCost+(items[i].amount*dbItem.cost);
    }
    totalCost=parseFloat(totalCost).toFixed(2);
   return totalCost;
 }
});