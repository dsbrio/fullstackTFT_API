
const express = require('express');

const {login, generaToken, validarToken,logout} = require('./utileria/login.js');
const {decrypt} = require('./utileria/general.js');

const router = express.Router();

//Endpoint para login de usuario en la aplicación, con admin / admin podeis entrar.
router.post('/login', (req, res) => {

    //obtenemos los parametros de la petición
    var username = req.body.username;

    decrypt(req.body.password, function(password){

        console.log('password:', password);

        login(username, password, function(loginOk, userInfo){
		
            if(loginOk){
               
                //llamamos a la funcion de generar token
                generaToken(userInfo, function(token){
    
                    //respondemos con el token generado y datos de usuario.
                    var data = {
                        "success":true,
                        "user" : userInfo, 
                        "token" : token
                    }
                    res.status(201).json(data);
                });
    
            }else{
        
                res.status(401).send({
                    success:false,
                    error: 'usuario o contraseña inválidos'
                })
            }		
        });

    });

   

    
});

//Realizamos un borrado del token para el usuario que lo contiene.
router.post('/logout', (req, res) => {

    //obtenemos los parametros de la petición, en este caso el token
   var token = req.headers['authorization'];

   validarToken(req.headers['authorization'], function(tokenValido){

        if(tokenValido){
            //Si el token es valido, entonces podemos borrarlo.
            logout(token, function(logoutOk){
                res.status(200).send({
                    success:logoutOk
                })
            });
            
        }else{
            res.status(401).json({success:false, message:"No autorizado."});
        }
   });
    
});

module.exports = router;