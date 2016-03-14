#! python
# -*- coding: UTF-8 -*-

import math
import cv2
import numpy as np

digit_classes = [
    {'width_normal': (3,2,1,1), 'alphabet': 'A', 'digit': 0},
    {'width_normal': (2,2,2,1), 'alphabet': 'A', 'digit': 1},
    {'width_normal': (2,1,2,2), 'alphabet': 'A', 'digit': 2},
    {'width_normal': (1,4,1,1), 'alphabet': 'A', 'digit': 3},
    {'width_normal': (1,1,3,2), 'alphabet': 'A', 'digit': 4},
    {'width_normal': (1,2,3,1), 'alphabet': 'A', 'digit': 5},
    {'width_normal': (1,1,1,4), 'alphabet': 'A', 'digit': 6},
    {'width_normal': (1,3,1,2), 'alphabet': 'A', 'digit': 7},
    {'width_normal': (1,2,1,3), 'alphabet': 'A', 'digit': 8},
    {'width_normal': (3,1,1,2), 'alphabet': 'A', 'digit': 9},
    {'width_normal': (1,1,2,3), 'alphabet': 'B', 'digit': 0},
    {'width_normal': (1,2,2,2), 'alphabet': 'B', 'digit': 1},
    {'width_normal': (2,2,1,2), 'alphabet': 'B', 'digit': 2},
    {'width_normal': (1,1,4,1), 'alphabet': 'B', 'digit': 3},
    {'width_normal': (2,3,1,1), 'alphabet': 'B', 'digit': 4},
    {'width_normal': (1,3,2,1), 'alphabet': 'B', 'digit': 5},
    {'width_normal': (4,1,1,1), 'alphabet': 'B', 'digit': 6},
    {'width_normal': (2,1,3,1), 'alphabet': 'B', 'digit': 7},
    {'width_normal': (3,1,2,1), 'alphabet': 'B', 'digit': 8},
    {'width_normal': (2,1,1,3), 'alphabet': 'B', 'digit': 9}
]
digit_1_decode = {
    'AAAAAA': 0,
    'AABABB': 1,
    'AABBAB': 2,
    'AABBBA': 3,
    'ABAABB': 4,
    'ABBAAB': 5,
    'ABBBAA': 6,
    'ABABAB': 7,
    'ABABBA': 8,
    'ABBABA': 9
}
def barcodeDecode(barcodeProcessed):
    # Transform image to gray scale 0.299*px[0]+0.587*px[1]+0.114*px[2]
    ## HScanline
    scan_x = len(barcodeProcessed)/2
    ## Smooth
    blur = cv2.blur(barcodeProcessed,(4,4))
    ## Binarize
    binarize_scanline(blur,scan_x)
    ## Boundary detection
    #   Calculate seed point (End of first space from image center)
    scan_pos = len(blur[scan_x])/2
    scan_seedpoint = 0
    while scan_pos < len(blur[scan_x]):
        if blur[scan_x][scan_pos] > 127:
            scan_seedpoint = scan_pos
        else:
            if scan_seedpoint != 0:
                break
        scan_pos += 1
    #   Get distances
    (barcode_begin, module_width, space_bars_widths) = detectBarcodeBoundaries(blur, scan_x, scan_seedpoint)
    ## Decode barcode
    #   Compute reference patern
    for digit_class in digit_classes:
        digit_class['width_reference'] = (
            digit_class['width_normal'][0] * round(module_width),
            digit_class['width_normal'][1] * round(module_width),
            digit_class['width_normal'][2] * round(module_width),
            digit_class['width_normal'][3] * round(module_width),
            )
    code_read = list()
    #   Process left data block
    inverted = False
    chunk_index = 3
    for i in range(chunk_index,chunk_index+4*6,4):
        if chunk_index == 0:
            chunk_len_0 = space_bars_widths[i+0] - round(module_width)
        else:
            chunk_len_0 = space_bars_widths[i+0]
        chunk_len_1 = space_bars_widths[i+1]
        chunk_len_2 = space_bars_widths[i+2]
        chunk_len_3 = space_bars_widths[i+3]
        r_s = (chunk_len_0, chunk_len_1, chunk_len_2, chunk_len_3)
        distances = list()
        for digit_class in digit_classes:
            distances.append({
                'alphabet': digit_class['alphabet'],
                'digit': digit_class['digit'],
                'distance': euclidean_dist_4d(digit_class['width_reference'], r_s)})
        distance = min(distances, key=lambda distance_dict: distance_dict['distance'])
        if i==chunk_index and distance['alphabet'] != 'A':
            inverted = True
        if inverted:
            distances = filter(lambda distance_dict: distance_dict['alphabet'] != 'A', distances)
            code_read.append(min(distances, key=lambda distance_dict: distance_dict['distance']))
        else:
            code_read.append(distance)
    #   Process right data block
    chunk_index = 3 + (4*6) + 5
    for i in range(chunk_index,chunk_index+4*6,4):
        if chunk_index == 0:
            chunk_len_0 = space_bars_widths[i+0] - round(module_width)
        else:
            chunk_len_0 = space_bars_widths[i+0]
        chunk_len_1 = space_bars_widths[i+1]
        chunk_len_2 = space_bars_widths[i+2]
        chunk_len_3 = space_bars_widths[i+3]
        r_s = (chunk_len_0, chunk_len_1, chunk_len_2, chunk_len_3)
        distances = list()
        for digit_class in digit_classes:
            distances.append({
                'alphabet': digit_class['alphabet'],
                'digit': digit_class['digit'],
                'distance': euclidean_dist_4d(digit_class['width_reference'], r_s)})
        distance = min(distances, key=lambda distance_dict: distance_dict['distance'])
        if not inverted:
            distances = filter(lambda distance_dict: distance_dict['alphabet'] == 'A', distances)
            code_read.append(min(distances, key=lambda distance_dict: distance_dict['distance']))
        else:
            code_read.append(distance)
    #   Check code
    digit_1_code = list()
    code_res = list()
    if inverted:
        code_read.reverse()
        digit_1_code = ['A' if alphabet['alphabet'] != 'A' else 'B' for alphabet in code_read]
    else:
        digit_1_code = [alphabet['alphabet'] for alphabet in code_read]
    digit_1_code = ''.join(digit_1_code[:6])
    code_res.append(str(digit_1_decode.get(digit_1_code,'0')))
    code_res.extend([str(code['digit']) for code in code_read])
    code_res = ''.join(code_res)
    ean_checksum = eanCheck((code_res[:-1]))

    # DEBUG Purpose only
    # print code_res
    # cv2.namedWindow('blur', cv2.WINDOW_NORMAL)
    # cv2.imshow('blur',blur)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    #   Return decoded read
    if code_res[-1] != str(ean_checksum):
        raise ValueError("ERROR: EAN-13 Cheksum fail:\t" + ''.join(code_res) + "\t checksum calculated: " + str(ean_checksum) + "\t given: " + code_res[-1])
        return ''
    else:
        return code_res

def euclidean_dist_4d(a, b):
    return math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2 + (a[3]-b[3])**2)

def eanCheck(ean):
    checksum = 0
    for i, digit in enumerate(reversed(ean)):
        checksum += int(digit) * 3 if (i % 2 == 0) else int(digit)
    
    return (10 - (checksum % 10)) % 10

def binarize_scanline(img,scan_x):
    # Compute luminance
    luminance = []
    for x in range(len(img[scan_x])):
        px = img[scan_x][x]
        luminance.append(px/255.0)
    #   Get locals max & min luminance
    luminance_x_local_max_min = []
    luminance_local_max = list()
    luminance_local_min = list()
    luminance_aux = 0
    luminance_last = 'dark'
    for x in range(1,len(img[scan_x])-1):
        # Check all pixels have luminance |max-lm(px)| - |lm(px)-min| > 0.01
        if luminance[x-1] - luminance[x] <= 0:
            # lighter region
            if luminance[x] - luminance[x+1] > 0:
                # darker
                if abs(luminance_aux - luminance[x]) >= 0.01:
                    if luminance_last == 'dark':
                        luminance_local_max.append((x,luminance[x]))
                        luminance_last = 'light'
                        luminance_aux = luminance[x]
        else:
            # darker region
            if luminance[x] - luminance[x+1] < 0:
                # lighter
                if abs(luminance_aux - luminance[x]) >= 0.01:
                    if luminance_last == 'light':
                        luminance_local_min.append((x,luminance[x]))
                        luminance_last = 'dark'
                        luminance_aux = luminance[x]
    #   Prune dark max & light min
    luminance_max_mean = np.mean([lum_tup[1] for lum_tup in luminance_local_max])
    luminance_min_mean = np.mean([lum_tup[1] for lum_tup in luminance_local_min])
    luminance_prune_limit = ((luminance_max_mean-luminance_min_mean)/2)+luminance_min_mean
    luminance_local_max_pruned = filter(lambda lum_tup:  lum_tup[1]>luminance_prune_limit , luminance_local_max)
    luminance_local_min_pruned = filter(lambda lum_tup:  lum_tup[1]<luminance_prune_limit , luminance_local_min)
    
    luminance_local_max_min = list()
    luminance_local_max_min.extend(luminance_local_max_pruned)
    luminance_local_max_min.extend(luminance_local_min_pruned)
    luminance_local_max_min = sorted(luminance_local_max_min, key=lambda x: x[0])

    # Threshold adaptative
    sensivity = len(img[scan_x]) / 76
    for x in range(len(img[scan_x])):
        lum_last = [lum_tup[1] for lum_tup in luminance_local_max_min if lum_tup[0]<=x]
        if len(lum_last)>=sensivity:
            lum_last = lum_last[-sensivity:]
        else:
            lum_last = [luminance_local_max_min[0][1],luminance_local_max_min[1][1]]
        lum_mean = np.mean(lum_last)
        if lum_mean > 1-(1/4):  lum_mean = 1-(1/4)
        threshold_level = lum_mean * 255
        if img[scan_x][x] > threshold_level:
            img[scan_x][x] = 255
        else:
            img[scan_x][x] = 0

def detectBarcodeBoundaries(img, scan_x, scan_seedpoint):
    #   Detect spaces, bars and bounds
    barcode_begin = 0
    space_bars_widths = list()
    #       Scan to left
    space_bars_last = 1
    bar_limit_x = scan_seedpoint + 1
    space_limit_x = scan_seedpoint
    scan_pos = scan_seedpoint
    while 0 < scan_pos:
        if img[scan_x][scan_pos] > 127:
            bar_limit_x = scan_pos
            space_bars_last = 1
            while 0 < scan_pos:
                if img[scan_x][scan_pos] > 127 and space_bars_last == 0:
                    space_bars_widths.insert(0, bar_limit_x - scan_pos)
                    space_bars_last = 1
                    space_limit_x = scan_pos
                if img[scan_x][scan_pos] < 127 and space_bars_last == 1:
                    space_bars_widths.insert(0, space_limit_x - scan_pos)
                    space_bars_last = 0
                    bar_limit_x = scan_pos
                scan_pos -= 1
            barcode_begin = space_limit_x
        scan_pos -= 1
    #       Scan to right
    space_bars_last = 1
    bar_limit_x = scan_seedpoint + 1
    space_limit_x = scan_seedpoint
    scan_pos = scan_seedpoint
    while scan_pos < len(img[scan_x]):
        if img[scan_x][scan_pos] < 127:
            bar_limit_x = scan_pos
            space_bars_last = 0
            while scan_pos < len(img[scan_x]):
                if img[scan_x][scan_pos] > 127 and space_bars_last == 0:
                    space_bars_widths.append(scan_pos - bar_limit_x)
                    space_bars_last = 1
                    space_limit_x = scan_pos
                if img[scan_x][scan_pos] < 127 and space_bars_last == 1:
                    space_bars_widths.append(scan_pos - space_limit_x)
                    space_bars_last = 0
                    bar_limit_x = scan_pos
                scan_pos += 1
        scan_pos += 1
    #       Check boundaries
    if len(space_bars_widths) != 3 + (4*6) + 5 + (4*6) + 3:
            if len(space_bars_widths) > 3 + (4*6) + 5 + (4*6) + 3 and img[scan_x][0] < 127:
                space_bars_widths.pop(0)
            if len(space_bars_widths) > 3 + (4*6) + 5 + (4*6) + 3 and img[scan_x][-1] < 127:
                space_bars_widths.pop(-1)
            if len(space_bars_widths) != 3 + (4*6) + 5 + (4*6) + 3:
                raise ValueError("ERROR: Cannot found 59 bars & spaces on the image:\t" + str(len(space_bars_widths)))
    module_width = (space_bars_widths[0]+space_bars_widths[1]+space_bars_widths[3+(6*4)+1]+space_bars_widths[3+(6*4)+2]+space_bars_widths[3+5+(2*6*4)+1]+space_bars_widths[3+5+(2*6*4)+2]) / 6.0
    return (barcode_begin,module_width,space_bars_widths)