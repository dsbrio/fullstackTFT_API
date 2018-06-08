
//Importamos la libreria para construir y validar token de seguridad.
var jwt = require('jsonwebtoken');

//Configuramos una clave privada, como no vamos a estar generando publica y privada --> El servidor tiene su clave para
//codificar y decodificar el token
var secretKey ='CarlosDavidLucasCDL';

//Funcion que valida si un usuario es valido.
exports.login = (username, password, callback) => {

    console.log(username);
    console.log(password);

    var loginValido = true;

    //Si alguno de los parametros no esta correctamente informado, retornamos false
    if(null==username || ""==username || null==password || ""==password){
        loginValido= false;
    }

    //los parametros vienen informados, validamos contra base de datos.
    if(!(username === 'oscar' && password === '1234')){
        
        //TODO

        

    }

    callback(loginValido);
};



//Funcion que genera un token
exports.generaToken = (token) => {



}

//Funcion que valida un token
exports.validarToken = (token) => {



}