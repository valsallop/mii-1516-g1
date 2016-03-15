#! python
# -*- coding: UTF-8 -*-
import os, sys
import re
import cloudinary
import cloudinary.uploader
base_dir = os.path.dirname(__file__) or '.'
package_lib = os.path.join(base_dir, 'lib')
sys.path.insert(0, package_lib)

DEF_IMG_DIR = r'./resources'

cloudinary.config(cloud_name = 'dc8yintyr', api_key = '886621214683373', api_secret = '36UlUsNU01d7v-7-BH4k2b-6hn8')

def deleteFromCloudinary(img_url):
    res = dict()
    if re.match(r'http://res.cloudinary.com/\w+/', img_url):
        search = re.search(r'v[0-9]+/[/.\w]+$', img_url)
        if search:
            pub_address_items = search.group(0).split("/")
            if len(pub_address_items[-1].split("."))>2:
                pub_address_items[-1] = ".".join(pub_address_items[-1].split(".")[:-1] )
            if len(pub_address_items) > 1:
                pub_name = "/".join(pub_address_items[1:])
                res = cloudinary.uploader.destroy(pub_name, invalidate = True)
    return res.get("result", None)