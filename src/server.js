
/*
 * Importamos las liberias necesarias
 * 
 */

const express = require('express');//facilita el maneja de las peticiones http, router
const bodyParser = require('body-parser');

//con esta instrucción, lo que realizamos es la importación solo de fork de todo lo que contiene el paquete child_process
const { fork } = require('child_process')

//importamos nuestro fichero router que contiene la definición de las url para la petición http.
const router = require('./router.js');
const routerPlayers = require('./routerPlayers.js');
const routerTeams = require('./routerTeams.js');

//indicamos el puerto en el que queremos que nuestro servidor este escuchando.
const port = 3000;

//creamos nuestra variable de aplicación.
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.set('port', process.env.PORT || 3000);

//indicamos la url base sobre la que va a atender peticiones nuestro servidor.
app.use('/api/v1/', router);
app.use('/api/v1/players', routerPlayers);
app.use('/api/v1/teams', routerTeams);

app.listen(app.get('port'));