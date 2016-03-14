#! python
# -*- coding: UTF-8 -*-
import sys, os
import unittest
import cv2

base_dir = os.path.dirname(__file__) or '.'
package_lib = os.path.join(base_dir, 'lib')
sys.path.insert(0, package_lib)

import main

DEF_IMG_DIR = r'./resources'

class BarcodeGetDataTests(unittest.TestCase):
    
    def test_barcode_get_data_load_img(self):
        img = cv2.imread(DEF_IMG_DIR + '/' + "barcode_preprocessed.jpg",0)
        result = main.getBarcodeData(img)
        self.assertIsNotNone(result)

    def test_barcode_get_data_load_img_error_no_img(self):
        img = 'This is not an image'
        
        try:
            result = main.getBarcodeData(img)
        except ValueError as e:
            self.assertTrue(True)
        else:
            self.assertTrue(False,'Should have returned an error')

    def test_barcode_get_data_load_img_error_bad_img(self):
        img = cv2.imread(DEF_IMG_DIR + r'/' + r"barcode_preprocessed.jpg")
        
        try:
            result = main.getBarcodeData(img)
        except ValueError as e:
            self.assertTrue(True)
        else:
            self.assertTrue(False,'Should have returned an error')

    def test_barcode_get_data_returns_correct_data(self):
        img = cv2.imread(DEF_IMG_DIR + r'/' + r"barcode_preprocessed.jpg",0)
        result_expected = '4015000523196'
        
        result = main.getBarcodeData(img)
        self.assertEqual(result_expected, result)

    def test_barcode_get_data_returns_correct_data_2(self):
        img = cv2.imread(DEF_IMG_DIR + r'/' + r"codeBar9.jpg",0)
        result_expected = '3222270189644'
        
        result = main.getBarcodeData(img)
        self.assertEqual(result_expected, result)