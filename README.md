# fullstackTFT_API
API tipo REST con nodejs y mongodb para el trabajo TFT del curso fullstack

Para poder ejecutar este servidor debemos seguir los pasos:

1- Realizar un npm install para instalar los paquetes necesarios.
2- Instalar mongodb en nuestra máquina.
3- Arrancar mongodb usando el comando correspondiente, en el caso de windows mongod.exe.
4- Abrir consola en la ruta RAIZ DEL PROYECTO y ejecutar node .\src\server.js. Con esta instrucción indicamos que arranque nuestro servidor.
5- El servidor esta arrancado en el puerto 3000. Cualquier petición ira sobre la url base : http://localhost:3000/api/v1/
6- Funcionamiento CRUD: ejemplo, insertar un equipo con jugadores:

{
  "name": "Atlético de Madrid",
  "shield": "El oso y madroño, y los colores del club",
  "colors" : "Rojo, Blanco",
  "stadium" : "Wanda metropolitano",
  "players": [
    {
      "name": "Antoine",
      "secondname": "Griezzman",
      "age" : 27,
	  "position" : "Delantero",
	  "characteristics": {
		"attack": "Muy bueno",
		"defense" : "Malo",
		"condition" : "Normal"
	  },
	  "comments" : "igual le queda poco en el equipo :D"
    },
    {
      "name": "Diego",
      "secondname": "Costa",
      "age" : 27,
	  "position" : "Delantero",
	  "characteristics": {
		"attack": "Muy bueno",
		"defense" : "Malo",
		"condition" : "Normal"
	  },
	  "comments" : "A ver si se sale en el mundial :D"
    }
  ]
}


