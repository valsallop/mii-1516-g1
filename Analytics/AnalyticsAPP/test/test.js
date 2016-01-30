exports.config={
	seleniumAddress: 'http://localhost:4444/wd/hub',

	specs:[
		'backend/TProducts01-getAllProducts.js',
		'backend/TProducts02-getProductByCode.js',
		'backend/TTrend01-getProductTrendReq.js',
		'backend/TPopularity01-getRecByPopReq.js',
		'backend/TPopularity02-RecByPop3Products.js',
		'backend/TDBSync01-getProduct.js',
		'backend/TDBSync02-SyncProducts.js',
	]
};