#! python
# -*- coding: UTF-8 -*-

import time
import math, random
import numpy as np
import cv2
import barcode_decode as processing

def barcodePreprocess(img):
    umbralmax = 50
    w, h = img.shape
    if (w+h) >= 4536:#si la imagen es grande
        umbralmax = 50
    elif (w+h)<= 3164 and (w+h)> 1456:#si la imagen es grande
        umbralmax = 25
    elif (w+h)<= 1456:#si la imagen es grande
        umbralmax = 20
    
    ero = compConex(img,umbralmax)
    
    recor = recortar(img,ero,w,h)
    
    rotada = rotar(img,ero,recor,umbralmax)

    #obligamos que la imagen sea horizontal
    #el escalado es alto/ancho para que la imagen resultante contenga los mismo que la original
    rows,cols = rotada.shape
    esc = float(float(cols)/float(rows))
    
    if rows<cols:
        horizontal = rotada
    else:
        M = cv2.getRotationMatrix2D((cols/2,rows/2),90,esc)
        horizontal = cv2.warpAffine(rotada,M,(cols,rows))

    if w >= 2592:
        resized_image = horizontal
    else:
        resized_image = cv2.resize(horizontal, (2592, 1944))
    return resized_image

def compConex(img,umbralmax):
    blur = cv2.bilateralFilter(img,9,90,90)
    w, h = img.shape
    s = (w+h)/48
    if s%2==0:
        s+=1
    
    ker = cv2.getStructuringElement(cv2.MORPH_RECT,(s,s))
    blackhat = cv2.morphologyEx(blur, cv2.MORPH_BLACKHAT, ker)

    (_, thresh) = cv2.threshold(blackhat, umbralmax*0.95, umbralmax, cv2.THRESH_BINARY)

    kerde = cv2.getStructuringElement(cv2.MORPH_RECT,(s,s))
    dil = cv2.dilate(thresh, kerde, iterations = 1)#la proporcion entre dilatacion y erosion es de 2

    ero = cv2.erode(dil, kerde, iterations = 2)
    
    return ero

def recortar(img,ero, w,h):
    it = 3 #si la imangen es muy baja
    w1, h1 = img.shape
    if (w+h) >= 4536:#si la imagen es grande
        it = ((w1+h1)/453)+10
    elif (w+h)<= 3164 and (w+h)> 1456:
        it = ((w1+h1)/260)+1
    elif (w+h)<= 1456:
        it = ((w1+h1)/270)+1
    
    #para solucionar problema de texto se une con codigo tocar aqui
    kerdi = cv2.getStructuringElement(cv2.MORPH_RECT,(3,3))
    dil2 = cv2.dilate(ero, kerdi, iterations = int(it*3))
    #con 2592x1944 -> 10 iteraciones

    
    im2, cnts, hierarchy = cv2.findContours(dil2.copy(),cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
    if len(cnts)>0:
        c = sorted(cnts, key = cv2.contourArea, reverse = True)[0]
        resultado = img.copy()
        x, y, width, height = cv2.boundingRect(c)
        roi = resultado[y:y+height, x:x+width]
    else:
        roi = img

    
    return roi

def rotar(img,ero,recor,umbralmax):
    
    w, h = img.shape
    dst = img.copy()
    im2, cnts, hierarchy = cv2.findContours(ero.copy(),cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
    c = sorted(cnts, key = cv2.contourArea, reverse = True)[0]
    
    rect = cv2.minAreaRect(c)
    box = np.int0(cv2.boxPoints(rect))
    
    #cv2.drawContours(dst, [box], -1, (0, 255, 0), 3)# Dibujamos el contorno en la imagen

    mask = np.zeros(dst.shape,np.uint8)#crea una mascara de 0 donde dibujar el contorno
    cv2.drawContours(mask,[box],0,255,-1)#dibuja el contorno rellenandolo con 255

    
    #edges = cv2.Canny(mask,50,150,apertureSize = 3)
    #edges = cv2.morphologyEx(mask, cv2.MORPH_GRADIENT, None)
    #edges = cv2.Sobel(mask,cv2.CV_8U,1,0,ksize=5) #sobelx8u
    edges = cv2.Sobel(mask,cv2.CV_8U,0,1,ksize=5) #sobely8u
    
    lines = cv2.HoughLines(edges,1,np.pi/180,50)
    
    if lines is None: #utilizamos este if para devolver la imagen si no se encuaentra ninguna linea
        dst2 = img
    else:       
        for rho,theta in lines[0]:
            a = np.cos(theta)
            b = np.sin(theta)
            x0 = a*rho
            y0 = b*rho
            x1 = int(x0 + 1000*(-b))
            y1 = int(y0 + 1000*(a))
            x2 = int(x0 - 1000*(-b))
            y2 = int(y0 - 1000*(a))
            cv2.line(dst,(x1,y1),(x2,y2),(0,0,255),2)
            
        rows,cols = recor.shape
        
        esc = float(float(cols)/float(rows))
        if theta > 1.5 and theta < 1.7: #identificamos si la imagen es considerada como imagen recta
            dst2 = recor
        else: #El angulo que nos da hough es en base al eje vertical mientras que el angulo que introducimos al metodo rotation debe ser en base al eje horizontal por lo cual usamos el complementario
            M = cv2.getRotationMatrix2D((cols/2,rows/2),(math.degrees(theta)-90),0.7)# complementario de theta esta en radianes, lo pasamos a grados
            dst2 = cv2.warpAffine(imgRecortada,M,(cols,rows))
            #Elimina el escalado realizado en la rotacion, quedandose solo con el codigo de barras de la imagen rotada) 
            imgComp1 = compConex(dst2,umbralmax)
            dst2 = recortar(dst2,imgComp1,w,h)
    return dst2