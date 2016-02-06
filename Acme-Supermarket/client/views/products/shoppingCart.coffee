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
				bootbox.alert res.secure_url  if Meteor.user()