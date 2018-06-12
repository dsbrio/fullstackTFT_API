

//Importamos la libreria para construir y validar token de seguridad.
var jwt = require('jsonwebtoken');

//Configuramos una clave privada, como no vamos a estar generando publica y privada --> El servidor tiene su clave para
//codificar y decodificar el token
var secretKey ='CarlosDavidLucasCDL';

//Importamos el modelo de usuario.
const {getUserByUsernamePassword, updateToken, getUserById} = require('.././model/userModel.js');

//Funcion que valida si un usuario es valido.
exports.login = (username, password, callback) => {

    var loginValido = false;

    //los parametros vienen informados, validamos contra base de datos.
    getUserByUsernamePassword(username, password).then((data)=>{
        
        var userInfo = {};

        if(null!=data && undefined!=data && data.length ==1){
            loginValido= true;
            userInfo = {
                id:data[0]._id,
                name:data[0].name,
                surname:data[0].surname,
                username:data[0].username,
                email:data[0].email
            };
        }
       
        callback(loginValido, userInfo);

    }).catch((err) => {
        console.log('Error obteniendo usuario de base de datos');
        console.log(err);
        loginValido= false;

        callback(loginValido, {});

    });
    
};



//Funcion que genera un token
exports.generaToken = (userInfo, callback) => {
    
    //Añadimos la información que sea necesaria para crear el token
    var tokenData = {
        user:userInfo        
    };

    //usamos la libreria para generar el token junto con la clave secreta.
    var token = jwt.sign(tokenData, secretKey, {
         expiresIn: 60 * 60 * 24 // expires in 24 hours
    })

    //almacenamos el token en la tabla de usuario para que se pueda consultar su validez en cada petición
    updateToken(userInfo,token).then((data)=>{
               

    }).catch((err) => {
        console.log('Error actualizando token');
        console.log(err);
    });

    //retornamos el token.
    callback(token);
}

//Funcion que valida un token comparandolo con el de base de datos.
//Para ello, busca con el id de usuario que viene en el token si existe en base de datos y además si los token coinciden.
//si no coinciden, no será valido, por tanto no pasará.
exports.validarToken = (token, callback) => {

	if(!token){       
        callback(false);
    }
	
	//se elimina, segun el tutorial xq lo añade por defecto http
    token = token.replace('Bearer ', '');

    //Verificamos con la clave secreta si el token es valido.
    jwt.verify(token, secretKey, function(err, tokenData) {
        if (err) {
            console.log('token invalido');
            console.log(err);
            callback(false);

        } else {
           
            //buscamos en base de datos a ver si existe usuario para ese token
            getUserById(tokenData.user.id).then((data) => {

                if(null!=data && undefined!=data && data.length ==1
                && token==data[0].token){
                    //existe un usuario con ese token.
                   callback(true);
                }else{
                    callback(false);
                }

            }).catch((err) => {
                console.log('Error buscando token');
                console.log(err);
                callback(false);
            });
        }
      });

}

exports.logout = (token, callback) => {

	//se elimina, segun el tutorial xq lo añade por defecto http
    token = token.replace('Bearer ', '');

    //Verificamos con la clave secreta si el token es valido.
    jwt.verify(token, secretKey, function(err, tokenData) {
        if (err) {
            console.log('token invalido');
            console.log(err);
            callback(false);

        } else {
           
            updateToken(tokenData.user,'').then((data)=>{
               
                callback(true);

            }).catch((err) => {
                console.log('Error logout token');
                console.log(err);
                callback(false);
            });           
        }

      });

}