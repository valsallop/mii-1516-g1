Meteor.methods({
	pearsonCorrelation:function(prefs, p1, p2) {
	  var si = [];

	  for (var key in prefs[p1]) {
	    if (prefs[p2][key]) si.push(key);
	  }

	  var n = si.length;

	  if (n == 0) return 0;

	  var sum1 = 0;
	  for (var i = 0; i < si.length; i++) sum1 += prefs[p1][si[i]];

	  var sum2 = 0;
	  for (var i = 0; i < si.length; i++) sum2 += prefs[p2][si[i]];

	  var sum1Sq = 0;
	  for (var i = 0; i < si.length; i++) {
	    sum1Sq += Math.pow(prefs[p1][si[i]], 2);
	  }

	  var sum2Sq = 0;
	  for (var i = 0; i < si.length; i++) {
	    sum2Sq += Math.pow(prefs[p2][si[i]], 2);
	  }

	  var pSum = 0;
	  for (var i = 0; i < si.length; i++) {
	    pSum += prefs[p1][si[i]] * prefs[p2][si[i]];
	  }

	  var num = pSum - (sum1 * sum2 / n);
	  var den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
	      (sum2Sq - Math.pow(sum2, 2) / n));

	  if (den == 0) return 0;

	  return num / den;
	},
	userSimilarity: function(){
		console.log("userSimilarity started")
		var userid=Meteor.userId();
		var mostSimilarUser;
		var highestSimilarity=-2
		var users=Meteor.users.find().fetch();
		var loggedUserRatings = Ratings.find({"userId":userid}).fetch();
		var loggedUserAverageRating=0.0;
		for(var i = 0; i<loggedUserRatings.length;i++){
			loggedUserAverageRating+=loggedUserRatings[i]['rating']
		}
		loggedUserAverageRating=loggedUserAverageRating/i;
		//console.log(loggedUserAverageRating);
		for(var i = 0; i<users.length;i++){
			if(users[i]['_id']!=userid){
				var otherRatings = Ratings.find({"userId": users[i]['_id']}).fetch();
				var userAverageRating=0.0;
				var count=0;
				var logged=[];
				var user=[];
				similarity=0.0;
				for(var j = 0; j<loggedUserRatings.length;j++){
					if(j==0){
						for(var k = 0; k<otherRatings.length;k++){
							userAverageRating+=otherRatings[k]['rating'];
							count+=1;
						}
					}
					if(count>0){
						if(j==0){
							userAverageRating=userAverageRating/count;
						}
						for(var k = 0; k<otherRatings.length;k++){
							if(loggedUserRatings[j]['proId']==otherRatings[k]['proId']){
								logged.push(loggedUserRatings[j]['rating']);
								user.push(otherRatings[k]['rating']);
								
							}
						}
					}
					
				}
				if(count>0){
					var data = new Array(
		                    logged,
		                    user
		        	);
					var similarity=Meteor.call('pearsonCorrelation',data,0,1);
				}
				//console.log("--------------------")
				if(similarity>highestSimilarity){
					highestSimilarity=similarity;
					mostSimilarUser=users[i];
				}
		        //console.log("similarity: "+similarity);
			}
		}
		
		
		// console.log(users);
		//console.log(loggedUserRatings);
		// console.log(otherRatings.length);
		console.log("userSimilarity finished")
		return mostSimilarUser
	},
	highestRatedProductByUser:function(){
		var user=Meteor.call('userSimilarity')
		//console.log("user",user)
		var ratings= Ratings.find({"userId": user['_id'],"rating":{ $gt: 3 }}, {sort: {rating: -1}}).fetch();
		//console.log(ratings)
		var items=[];
		for(var j = 0; j<ratings.length;j++){
			//console.log("proid"+ratings[j]['proId'])
			var oid = new Meteor.Collection.ObjectID(ratings[j]['proId']);
			items.push(Products.findOne({"_id":oid})['code'])
		}
		return items;
	}
});

//console.log(Meteor.call('userSimilarity'))
//console.log("items",Meteor.call('highestRatedProductByUser'))
