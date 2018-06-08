

//Importamos la libreria para construir y validar token de seguridad.
var jwt = require('jsonwebtoken');

//Configuramos una clave privada, como no vamos a estar generando publica y privada --> El servidor tiene su clave para
//codificar y decodificar el token
var secretKey ='CarlosDavidLucasCDL';

//Importamos el modelo de usuario.
const {getUserByUsernamePassword, updateToken, getUserByToken} = require('.././model/userModel.js');

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
        username: userInfo.username,
        id:userInfo._id,
    };

    //usamos la libreria para generar el token junto con la clave secreta.
    var token = jwt.sign(tokenData, secretKey, {
         expiresIn: 60// * 60 * 24 // expires in 24 hours
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

//Funcion que valida un token
exports.validarToken = (token, callback) => {

    var respuesta = false;
	
	if(!token){       
        respuesta =  false;
    }
	
	//se elimina, segun el tutorial xq lo añade por defecto http
    token = token.replace('Bearer ', '');

    //Verificamos con la clave secreta si el token es valido.
    jwt.verify(token, secretKey, function(err, tokenData) {
        if (err) {
            console.log('token invalido');
            console.log(err);
          respuesta =  false;
        } else {
            console.log('token valido');
            console.log('tokenData',tokenData);             
            

            //buscamos en base de datos a ver si existe usuario para ese token
            getUserByToken(token).then((data) => {

                if(null!=data && undefined!=data && data.length ==1){
                    //existe un usuario con ese token.
                    var userInfo = data[0];


                    console.log('userInfo',userInfo);
                    
                }


            }).catch((err) => {
                console.log('Error buscando token');
                console.log(err);
            });
        }
      });
		 
	 callback(respuesta);

}