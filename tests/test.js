exports.config={
	seleniumAddress: 'http://localhost:4444/wd/hub',

	specs:[
		'backend/TC01-getFoundProducts.js',
		'backend/TC01-getFoundRecomended.js'

	]
};