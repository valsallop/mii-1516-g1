this.ShoppingCarts = new Meteor.Collection('shoppingCarts');
Schema = {};

Schema.item = new SimpleSchema({
    productCode: {
        type: String,
        optional:true 
    },
    amount: {
        type: Number,
        min: 1,
        max:999,
        optional:true 
    }
});
Schema.shoppingCart = new SimpleSchema({
    userId: {
        type: String
    },
    items: {
        type: [Schema.item],
        optional:true        
    },
    active: {
        type: Boolean,
        optional:true 
    },
    orderDate:{
    	type:Date,
    	optional:true
    },
    paymentDate:{
    	type:Date,
    	optional:true
    }
});


ShoppingCarts.attachSchema(Schema.shoppingCart);