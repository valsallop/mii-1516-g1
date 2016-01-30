if not exist "%0\..\data" mkdir %0\..\data
start /min mongod --dbpath "%0\..\data"
