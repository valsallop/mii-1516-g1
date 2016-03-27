Template.home.helpers({
	recommendationItems: function(){
    Meteor.call("highestRatedProductByUser", function(error, result){
      if(error){
        console.log(error.reason);
        return;
      }
      console.log(result);
      return Session.set('recommendationsItems',result);
    });
    	
  }
});

Template.recommenderItems.helpers({
  isItem1: function(){
    res = false
    if (Session.get('recommendationsItems').length>0){
      res = true
    }
    return res
  },
  isItem2: function(){
    res = false
    if (Session.get('recommendationsItems').length>4){
      res = true
    }
    return res
  },
  isItem3: function(){
    res = false
    if (Session.get('recommendationsItems').length>8){
      res = true
    }
    return res
  },
  isItem4: function(){
    res = false
    if (Session.get('recommendationsItems').length>12){
      res = true
    }
    return res
  },
  recomendations1: function(){
    var response = Session.get('recommendationsItems');
    var items = []
    if (response.length >= 4){
      for (i = 0; i < 4; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }else{
      for (i = 0; i < response.length; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }

    return items
  },
  recomendations2: function(){
    var response = Session.get('recommendationsItems');
    var items = []

    if (response.length >= 8){
      for (i = 4; i < 8; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }else{
      for (i = 4; i < response.length; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }

    return items
  },
  recomendations3: function(){
    var response = Session.get('recommendationsItems');
    var items = []

    if (response.length >= 12){
      for (i = 8; i < 12; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }else{
      for (i = 8; i < response.length; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }
    return items
  },
  recomendations4: function(){
    var response = Session.get('recommendationsItems');
    var items = []

    if (response.length >= 16){
      for (i = 12; i < 16; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }else{
      for (i = 12; i < response.length; i++) { 
        var dbItem=Products.findOne({code:parseInt(response[i])});
        items.push(dbItem);
      }
    }
    return items
  }
});