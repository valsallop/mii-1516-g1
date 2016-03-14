Para ejecutar
1º	Instalar virtualenv
pip install virtualenv
2º	Activar el entorno virtual
v_env_d3\Scripts\activate
3º	Instalar dependencias
pip install -r requirements.txt
4º	Ejecutar normalmente
python ImgProcessing.py

Para ejecutar tests
1º	Activar entorno virtual
v_env_d3\Scripts\activate
3º	Ejecutar nosetest
v_env_d3\Scripts\nosetests.exe -s tests\testx.py