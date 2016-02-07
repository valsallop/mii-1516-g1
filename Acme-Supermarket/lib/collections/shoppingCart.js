this.ShoppingCarts = new Meteor.Collection('shoppingCarts');
Schema = {};

Schema.item = new SimpleSchema({
    productCode: {
        type: Number,
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
    deliveryDate:{
    	type:Date,
    	optional:true
    },
    paymentDate:{
    	type:Date,
    	optional:true
    },
    userName:{
        type: String,
        optional:true
    },
    deliveryAddress:{
        type: String,
        optional:true
    }
});


ShoppingCarts.attachSchema(Schema.shoppingCart);