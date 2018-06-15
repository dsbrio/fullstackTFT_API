
const express = require('express');
const { fork } = require('child_process');

const addTeamProcessUrl = 'src/process/team/addTeamProcess.js';
const updateTeamProcessUrl = 'src/process/team/updateTeamProcess.js';
const deleteTeamProcessUrl = 'src/process/team/deleteTeamProcess.js';
const deletePlayerProcessUrl = 'src/process/player/deletePlayerProcess.js';
const addPlayerProcessUrl = 'src/process/player/addPlayerProcess.js';
const updatePlayerProcessUrl = 'src/process/player/updatePlayerProcess.js';

const {login, generaToken, validarToken,logout} = require('./utileria/login.js');

//importamos solo las funciones del modelo que vamos a usar desde el router.
const {getTeams, getTeamById, deleteAll, getTeamNameById} = require('./model/teamModel.js');

//importamos solo las funciones del modelo que vamos a usar desde el router.
const {getPlayerById, getPlayersByTeamId, getAllPlayers,getAllPlayersByTeamId} = require('./model/playerModel.js');

const router = express.Router();

//Endpoint para login de usuario en la aplicación, con admin / admin podeis entrar.
router.post('/login', (req, res) => {

    //obtenemos los parametros de la petición
    var username = req.body.username;
    var password = req.body.password;

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

//creación del equipo con proceso hijo.
router.post('/teams',(req,res)=>{

    validarToken(req.headers['authorization'], function(tokenValido){

        if(tokenValido){

            //obtenemos el campo body de la petición
            let data = req.body;

            //Obtenemos el proceso hijo
            const addTeamProcess = fork(addTeamProcessUrl);

            //añadimos un evento al proceso hijo, para que envie los datos del json de respuesta.
            addTeamProcess.on('message', (responseBBDD) => {

                var response ={
                    success:true,
                    data : responseBBDD
                };
                res.status(201).json(response);
            });

            addTeamProcess.on('exit', () => {
                //Respondemos con OK
                res.status(500).json({ success:false, error:'Error creando equipo.'});
            
            });

            //ejecutamos el proceso.
            addTeamProcess.send(data);

        }else{
            //token no valido, 401
            res.status(401).json({success:false, message:"No autorizado."});
        }
    });

});


//listado de equipo sin proceso hijo
router.get('/teams', (req, res)=>{

        //obtenemos los resultados.
        getTeams().then((listaEquipos)=>{
            
            res.status(200).json({success:true, data:listaEquipos});

        }).catch((err) => {
            console.log('Error obteniendo lista de equipos');
            console.log(err);
            res.status(500).json({success:false});
        });
});

//busqueda de equipo por id sin proceso hijo
router.get('/teams/:id', (req, res)=>{

    let teamId = req.params.id;

    getTeamById(teamId).then((teamData)=>{
        console.log('Equipo obtenido correctamente.');

        getPlayersByTeamId(teamId).then((playersData)=>{

            var teamDataMod = teamData.toObject();
            teamDataMod.players = {playersData};

            var response = {
                success:true,
                data:teamDataMod
            }
            
            res.status(200).json(response);

        }).catch((err) => {
            console.log('Error obteniendo jugadores del equipo');
            console.log(err);
            res.status(500).json({success:false});
        });

    }).catch((err) => {
        console.log('Error obteniendo equipo');
        console.log(err);
        res.status(500).json({success:false});
    });
});


//actualización de equipo con proceso hijo.
router.patch('/teams/:id', (req, res)=>{
   
    validarToken(req.headers['authorization'], function(tokenValido){

        let data = req.body;
        data.id = req.params.id;

        //realizamos llamada al proceso hijo.
        const updateTeamProcess = fork(updateTeamProcessUrl);
    
        //añadimos un evento al proceso hijo, para que envie los datos del json de respuesta.
        updateTeamProcess.on('message', (responseUpdateBBDD) => {
            //Respondemos con OK
            var response = {
                success:true,
                data:responseUpdateBBDD
            };
            res.status(201).json(response);
        });

        updateTeamProcess.on('exit', () => {
            //Respondemos con OK
            res.status(500).json({success:false,error:'Error actualizando equipo.'});
        
        });

        updateTeamProcess.send(data);   
    });
});

//eliminación de equipo sin proceso hijo.
router.delete('/team/:id', (req, res)=>{
    validarToken(req.headers['authorization'], function(tokenValido){

        let data = {
            id : req.params.id
        }
    
        //realizamos llamada al proceso hijo.
        const deleteTeamProcess = fork(deleteTeamProcessUrl);
    
        //añadimos un evento al proceso hijo, para que envie los datos del json de respuesta.
        deleteTeamProcess.on('message', (responseUpdateBBDD) => {
            //Respondemos con OK
            var response = {
                success:true,
                data:responseUpdateBBDD
            };
            res.status(201).json(response);
        });

        deleteTeamProcess.on('exit', () => {
            //Respondemos con OK
            res.status(500).json({  success:false,error:'Error actualizando usuario.'});
        
        });

        deleteTeamProcess.send(data); 
    });
    
});

//eliminación de todos los equipos
router.delete('/teams', (req, res)=>{
       
    validarToken(req.headers['authorization'], function(tokenValido){
        if(tokenValido){
            deleteAll().then((data)=>{
                console.log('Equipos borrados correctamente')
                res.status(200).json({success:true});

            }).catch((err) => {
                console.log('Error borrando equipos');
                console.log(err);
                res.status(500).json({success:false});
            });   
        }else{
            //token no valido, 401
            res.status(401).json({success:false, message:"No autorizado."});
        }
    });
    
    
});


//creación del jugador con proceso hijo.
router.post('/players',(req,res)=>{

    validarToken(req.headers['authorization'], function(tokenValido){

        console.log('tokenValido',tokenValido);

        if(tokenValido){

            let data = req.body;
            data.id = req.params.id;

            //realizamos llamada al proceso hijo.
            const addPlayerProcess = fork(addPlayerProcessUrl);
        
            //añadimos un evento al proceso hijo, para que envie los datos del json de respuesta.
            addPlayerProcess.on('message', (responseUpdateBBDD) => {
                //Respondemos con OK
                var response = {
                    success:true,
                    playerId:responseUpdateBBDD._id
                };
                res.status(201).json(response);
            });

            addPlayerProcess.on('exit', () => {
                //Respondemos con OK
                res.status(500).json({success:false,error:'Error creando jugador.'});
            
            });

            addPlayerProcess.send(data);   

        }else{
            //token no valido, 401
            res.status(401).json({success:false, message:"No autorizado."});
        }
    });

});


//obtención de jugadores sin proceso hijo.
router.get('/players',(req,res)=>{
    
    getAllPlayers().then((data)=>{
        console.log('Jugadores obtenidos correctamente');
        var response = {
            success:true,
            data:data
        };
        res.status(200).json(response);

    }).catch((err) => {
        console.log('Error obteniendo jugadores');
        console.log(err);
        res.status(500).json({success:false});
    });  
    
});


//obtención del jugador sin proceso hijo.
router.get('/players/:id',(req,res)=>{

    let data = {
        id:req.params.id
    };
    
    getPlayerById(data.id).then((data)=>{

        var playerInfo={};

        if(null!=data && data.length==1){
            playerInfo=data[0];
        }
        
        getTeamNameById(playerInfo.team).then((data)=>{

            let player = playerInfo.toObject();

            player.teamName = data.name;
            
            var response = {
                success:true,
                data:player
            };
            res.status(200).json(response);

        }).catch((err) => {
            console.log('Error obteniendo jugador');
            console.log(err);
            res.status(500).json({success:false});
        });  
    }).catch((err) => {
        console.log('Error obteniendo jugador');
        console.log(err);
        res.status(500).json({success:false});
    });  
    
});


//edición del jugador sin proceso hijo.
router.patch('/players/:id',(req,res)=>{

    validarToken(req.headers['authorization'], function(tokenValido){

        if(tokenValido){

            let data = req.body;
            data.id = req.params.id;

            //realizamos llamada al proceso hijo.
            const updatePlayerProcess = fork(updatePlayerProcessUrl);
        
            //añadimos un evento al proceso hijo, para que envie los datos del json de respuesta.
            updatePlayerProcess.on('message', (responseUpdateBBDD) => {
                //Respondemos con OK
                var response = {
                    success:true
                };
                res.status(201).json(response);
            });

            updatePlayerProcess.on('exit', () => {
                //Respondemos con OK
                res.status(500).json({success:false,error:'Error actualizando jugador.'});
            
            });

            updatePlayerProcess.send(data);   

        }else{
            //token no valido, 401
            res.status(401).json({success:false, message:"No autorizado."});
        }
    });

});

//eliminación de jugador con proceso hijo.
router.delete('/players/:id', (req, res)=>{
    
    validarToken(req.headers['authorization'], function(tokenValido){


        let data = {
            id : req.params.id
        }
    
        //realizamos llamada al proceso hijo.
        const deletePlayerProcess = fork(deletePlayerProcessUrl);
    
        //añadimos un evento al proceso hijo, para que envie los datos del json de respuesta.
        deletePlayerProcess.on('message', (data) => {
            //Respondemos con OK
            var response = {
                success:true,
                data:data
            };
            res.status(201).json(response);
        });

        deletePlayerProcess.on('exit', () => {
            //Respondemos con KO
            res.status(500).json({ success:false,error:'Error eliminando jugador.'});
        
        });

        deletePlayerProcess.send(data); 
    });
    
});


//obtención de jugadores asociados a un equipo, pasandole el id del equipo.
router.get('/players/team/:id',(req,res)=>{
    
    getAllPlayersByTeamId(req.params.id).then((data)=>{
        console.log('Jugadores obtenidos correctamente');
        var response = {
            success:true,
            data:data
        };
        res.status(200).json(response);

    }).catch((err) => {
        console.log('Error obteniendo jugadores');
        console.log(err);
        res.status(500).json({success:false});
    });  
    
});

module.exports = router;