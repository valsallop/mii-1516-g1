$.cloudinary.config
	cloud_name: 'acmesupermarket'
	api_key: '525973421529483'


Template.shoppingCart.events
	"change input.file_bag": (e) ->
		files = e.currentTarget.files

		Cloudinary.upload files,
			folder:"secret" # optional parameters described in http://cloudinary.com/documentation/upload_images#remote_upload
			(err,res) -> #optional callback, you can catch with the Cloudinary collection as well
				console.log "Upload Error:"
				console.log err
				console.log "Upload Result:"
				console.log res
				#bootbox.alert res.secure_url  if Meteor.user()

				HTTP.call 'POST', 'http://madeng777.no-ip.biz:4342/jsonrpc', {
					data: {
						"method": "barcode",
						"params": {
							"imgUrl": res.secure_url,
							"deleteAfterProc": "1"
						},
						"jsonrpc": "2.0",
						"id": "1988"
					}
					}, (error, response) ->
				  	if error
				    	console.log error
				  	else
				    	responseJson = JSON.parse(response.content)
				    	if responseJson.result.length == 13
				    		dbItem = Products.findOne(code: parseInt(responseJson.result))
				    		if dbItem == undefined
				    			bootbox.alert TAPi18n.__('uploadPImgNoProduct', lang_tag = null) if Meteor.user()
				    		else
				    			Meteor.call 'addToCart', responseJson.result
				    	else
				    		bootbox.alert TAPi18n.__('uploadPImgBarcodeError', lang_tag = null)  if Meteor.user()
				  	return