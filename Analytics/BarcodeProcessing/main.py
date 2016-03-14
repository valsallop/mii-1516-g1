import os, sys
import argparse
import time
import math, random
import numpy as np
import traceback

from urllib2 import urlopen
from werkzeug.wrappers import Request, Response
from werkzeug.serving import run_simple
from jsonrpc import JSONRPCResponseManager, dispatcher

import cv2

base_dir = os.path.dirname(__file__) or '.'
package_lib = os.path.join(base_dir, 'lib')
sys.path.insert(0, package_lib)
import barcode_preprocessing as preprocessing
import barcode_decode as processing



def getBarcodeData(img):
    if str(type(img)) != "<type 'numpy.ndarray'>":
        raise ValueError("ERROR: getBarcodeData image given is not valid. Type: "+str(type(img)))
    barcode_img = img
    preprocessed_img = preprocessing.barcodePreprocess(barcode_img)
    barcode_data = processing.barcodeDecode(preprocessed_img)
    return barcode_data

'''
    Get image from given url & give it to process barcode funtion
    To tests with Postman:
        URL
            localhost:4000/jsonrpc
        Body
            JSON (application/json)
        Body -> Raw
            {"method": "barcode","params": {"imgUrl": "http://www.dia.es/medias/?context=bWFzdGVyfHJvb3R8MTAxMDh8aW1hZ2UvcG5nfGhiNS9oZGEvODgxODI3MzQ4NDgzMC5wbmd8Yjc2NWVjY2MxNmM4MTkzYjkyMjM0MDE1ZWU2MjQ3OTdkNmY0ZDcxYWQ0MTc5NTk4NDE2MzJkZDZhMTc0NzQ5Yw"},"jsonrpc": "2.0","id": "1988"}
'''
def processBarcodeImg(**kwargs):
    if "echo" in kwargs.keys():
        if kwargs["echo"]:
            return "echo"
        else:
            return None
    elif "imgUrl" in kwargs.keys():
        try:
            request = urlopen(kwargs["imgUrl"])
            img_array = np.asarray(bytearray(request.read()), dtype=np.uint8)
            img = cv2.imdecode(img_array, 0)
            res = getBarcodeData(img)
            if "deleteAfterProc" in kwargs.keys():
                # Eliminar de Cloudinary
                pass

            return res
        except ValueError, e:
            tb = traceback.format_exc()
            return str(e)
        except Exception, e:
            tb = traceback.format_exc()
            return "Uncaught server error:\t" + str(tb)
    else:
        raise ValueError("Invalid params")

@Request.application
def application(request):
    dispatcher["echo"] = lambda s: s
    dispatcher["barcode"] = processBarcodeImg

    response = JSONRPCResponseManager.handle(
        request.get_data(cache=False, as_text=True), dispatcher)
    return Response(response.json, mimetype='application/json') 


def runServer():
    run_simple('localhost', 4000, application)

if __name__ == '__main__':
    print "Starting server..."
    runServer()
