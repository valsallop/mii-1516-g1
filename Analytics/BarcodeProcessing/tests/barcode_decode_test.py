#! python
# -*- coding: UTF-8 -*-
import sys, os
import unittest
import cv2

base_dir = os.path.dirname(__file__) or '.'
package_lib = os.path.join(base_dir, 'lib')
sys.path.insert(0, package_lib)

import barcode_processing

DEF_IMG_DIR = './resources'

class BarcodeDecodeTests(unittest.TestCase):
    
    def test_barcode_decode_load_preprocessed_img(self):
        #img = cv2.imread(DEF_IMG_DIR + '/' + "barcode_preprocessed.jpg")
        #img = cv2.imread(DEF_IMG_DIR + '/' + "barcode_preprocessedMODIFIED.jpg")
        #img = cv2.imread(DEF_IMG_DIR + '/' + "codeBar1.jpg") #no esta entero!
        #img = cv2.imread(DEF_IMG_DIR + '/' + "codeBar2.jpg")
        #img = cv2.imread(DEF_IMG_DIR + '/' + "codeBar3.jpg")
        #img = cv2.imread(DEF_IMG_DIR + '/' + "codeBar4.jpg")
        img = cv2.imread(DEF_IMG_DIR + '/' + "codeBar6.jpg")
        #img = cv2.imread(DEF_IMG_DIR + '/' + "codeBar4INVERTED.jpg")
        expected_result = 0
        
        result = barcode_processing.barcodeDecode(img)
        self.assertTrue(len(result)>0)
        print result