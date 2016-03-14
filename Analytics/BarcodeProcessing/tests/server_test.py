#! python
# -*- coding: UTF-8 -*-

import unittest
import requests
import json
import img_processing

class ImgProcessingTestsServerBasics(unittest.TestCase):
    def setUp(self):
        self.url = "http://localhost:4000/jsonrpc"
        self.headers = {'content-type': 'application/json'}

    def tearDown(self):
        pass

    def test_server_basics_echo(self):
        # Example echo method
        payload = {
            "method": "echo",
            "params": ["echome!"],
            "jsonrpc": "2.0",
            "id": 0,
        }
        response = requests.post(
            self.url, data=json.dumps(payload), headers=self.headers).json()

        self.assertEqual("echome!", response["result"])
        self.assertEqual("2.0", response["jsonrpc"])
        self.assertEqual(0, response["id"])

 
    def test_server_basics_echo_barcode_method_returns_echo(self):
        payload = {
            "method": "barcode",
            "params": {'echo': 'true'},
            "jsonrpc": "2.0",
            "id": 1,
        }
        response = requests.post(
            self.url, data=json.dumps(payload), headers=self.headers).json()
        
        self.assertEqual("echo", response["result"])
        self.assertEqual("2.0", response["jsonrpc"])
        self.assertTrue("error" not in response)
        self.assertEqual(1, response["id"])

    def test_server_basics_echo_barcode_method_returns_none(self):
        payload = {
            "method": "barcode",
            "params": {'echo': False},
            "jsonrpc": "2.0",
            "id": 6,
        }
        response = requests.post(
            self.url, data=json.dumps(payload), headers=self.headers).json()
        
        self.assertEqual(None, response["result"])
        self.assertEqual("2.0", response["jsonrpc"])
        self.assertTrue("error" not in response)
        self.assertEqual(6, response["id"])
 
    def test_server_basics_barcode_exc(self):
        # Example exception
        payload = {
            "method": "barcode",
            "params": [0],
            "jsonrpc": "2.0",
            "id": 4,
        }
        response = requests.post(
            self.url, data=json.dumps(payload), headers=self.headers).json()
        
        self.assertEqual("Invalid params", response["error"]["message"])
        self.assertEqual("2.0", response["jsonrpc"])
        self.assertEqual(-32602, response["error"]["code"])
        self.assertEqual(4, response["id"])

class ImgProcessingTestsServerImgPreprocessing(unittest.TestCase):
    def setUp(self):
        self.url = "http://localhost:4000/jsonrpc"
        self.headers = {'content-type': 'application/json'}

    def tearDown(self):
        pass

    def test_server_basics_get_img(self):
        imgUrl = "http://farm4.static.flickr.com/3279/2923038275_ae205c7e31.jpg"
        payload = {
            "method": "barcode",
            "params": {"imgUrl": imgUrl} ,
            "jsonrpc": "2.0",
            "id": 0,
        }
        result_expected = u"8888425350403"
        response = requests.post(
            self.url, data=json.dumps(payload), headers=self.headers).json()
        self.assertEqual(result_expected, response["result"])
        self.assertEqual("2.0", response["jsonrpc"])
        self.assertEqual(0, response["id"])

    def test_server_decode(self):
        imgUrl = "http://cache3.asset-cache.net/gc/141864529-unit-price-label-or-barcode-on-milk-carton-gettyimages.jpg?v=1&c=IWSAsset&k=2&d=XOPGg300Ji9DpiYW4aefJZnhcYcmrPa9XkiFvamwJzLPEWd38TkeX3v6MEH4EkqG"
        payload = {
            "method": "barcode",
            "params": {"imgUrl": imgUrl} ,
            "jsonrpc": "2.0",
            "id": 0,
        }
        result_expected = u"0026400293309"
        response = requests.post(
            self.url, data=json.dumps(payload), headers=self.headers).json()
        self.assertEqual(result_expected, response["result"])
        self.assertEqual("2.0", response["jsonrpc"])
        self.assertEqual(0, response["id"])

    def test_server_decode_2(self):
        imgUrl = "http://res.cloudinary.com/dc8yintyr/image/upload/v1457954857/barcodes/codeBar4INVERTED.jpg.jpg"
        payload = {
            "method": "barcode",
            "params": {"imgUrl": imgUrl} ,
            "jsonrpc": "2.0",
            "id": 0,
        }
        result_expected = u"2000354891802"
        response = requests.post(
            self.url, data=json.dumps(payload), headers=self.headers).json()
        self.assertEqual(result_expected, response["result"])
        self.assertEqual(0, response["id"])

    def test_server_decode_n_remove(self):
        imgUrl = "http://res.cloudinary.com/dc8yintyr/image/upload/v1457954857/barcodes/codeBar4INVERTED.jpg.jpg"
        payload = {
            "method": "barcode",
            "params": {"imgUrl": imgUrl, "deleteAfterProc": 1} ,
            "jsonrpc": "2.0",
            "id": 22,
        }
        result_expected = u"2000354891802"
        response = requests.post(
            self.url, data=json.dumps(payload), headers=self.headers).json()
        self.assertEqual(result_expected, response["result"])
        self.assertEqual(22, response["id"])



if __name__ == '__main__':
    unittest.main()