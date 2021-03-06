
const express = require('express');
const { fork } = require('child_process');

const deletePlayerProcessUrl = 'src/process/player/deletePlayerProcess.js';
const addPlayerProcessUrl = 'src/process/player/addPlayerProcess.js';
const updatePlayerProcessUrl = 'src/process/player/updatePlayerProcess.js';

const {validarToken} = require('./utileria/login.js');

//importamos solo las funciones del modelo que vamos a usar desde el router.
const {getAllPlayers,getAllPlayersByTeamId, deleteAll} = require('./model/playerModel.js');

const routerPlayers = express.Router();

var  multer   = require ('multer') 
var  upload  = multer () 


//creación del jugador con proceso hijo.
routerPlayers.post('/', upload.single('photo'), (req,res)=>{

    console.log('req.file', req.file);
    console.log('req.body', req.body);

    validarToken(req.headers['authorization'], function(tokenValido){

        console.log('tokenValido',tokenValido);

        if(tokenValido){

            let data = req.body;
            data.id = req.params.id;

            if(req.file != undefined){
                data.photo = new Buffer(req.file.buffer, 'binary').toString('base64');
            }

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
routerPlayers.get('/',(req,res)=>{
    
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

//edición del jugador con proceso hijo.
routerPlayers.patch('/:id', upload.single('photo'), (req,res)=>{

    console.log('req.file', req.file);
    console.log('req.body', req.body);
    
    validarToken(req.headers['authorization'], function(tokenValido){

        if(tokenValido){

            let data = req.body;
            data.id = req.params.id;

            if(req.file != undefined){
                data.photo = new Buffer(req.file.buffer, 'binary').toString('base64');
            }

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
routerPlayers.delete('/:id', (req, res)=>{
    
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


//eliminación de jugadores
routerPlayers.delete('/', (req, res)=>{
    
    validarToken(req.headers['authorization'], function(tokenValido){
    
        deleteAll().then((data)=>{

            var response = {
                success:true
            };
            res.status(200).json(response);

        }).catch((err) => {
            console.log('Error borrando jugadores');
            console.log(err);
            res.status(500).json({success:false});
        });  
    });
    
});


//obtención de jugadores sin equipo.
routerPlayers.get('/team/none',(req,res)=>{
    
    getAllPlayersByTeamId(null).then((data)=>{
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

//obtención de jugadores asociados a un equipo, pasandole el id del equipo.
routerPlayers.get('/team/:id',(req,res)=>{
    
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


module.exports = routerPlayers;