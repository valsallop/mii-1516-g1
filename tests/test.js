exports.config={
	seleniumAddress: 'http://localhost:4444/wd/hub',

	specs:[
		//'backend/TC01-getFoundProducts.js',
		'backend/TC01-getFoundRecomended.js',
		'backend/TC03-postRegistration.js'
		/*,
		'backend/UC01-BadUsername.js',
		'backend/UC02-BadPassword.js',
		'backend/UC03-LoginSuccess.js'
*/
	]
};