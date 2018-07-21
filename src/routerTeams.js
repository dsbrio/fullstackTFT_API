
const express = require('express');
const { fork } = require('child_process');

const addTeamProcessUrl = 'src/process/team/addTeamProcess.js';
const updateTeamProcessUrl = 'src/process/team/updateTeamProcess.js';
const deleteTeamProcessUrl = 'src/process/team/deleteTeamProcess.js';

const {validarToken} = require('./utileria/login.js');

//importamos solo las funciones del modelo que vamos a usar desde el router.
const {getTeams, getTeamById, deleteAll} = require('./model/teamModel.js');

//importamos solo las funciones del modelo que vamos a usar desde el router.
const {getPlayersByTeamId} = require('./model/playerModel.js');

const routerTeams = express.Router();

var  multer   = require ('multer') 
var  upload  = multer () 
var fs = require('fs');

routerTeams.post('/', upload.single('shield'), (req, res) => {
    // req.file is the `photo` file
    // req.body will hold the text fields, if there were any

    console.log('req.file', req.file);
    console.log('req.body', req.body);

    validarToken(req.headers['authorization'], function(tokenValido){

        if(tokenValido){

            //obtenemos el campo body de la petición
            let data = req.body;

            if(req.file != undefined){
                data.shield = new Buffer(req.file.buffer, 'binary').toString('base64');
            }
            
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

})

//listado de equipo sin proceso hijo
routerTeams.get('/', (req, res)=>{

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
routerTeams.get('/:id', (req, res)=>{

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
routerTeams.patch('/:id', upload.single('shield'), (req, res)=>{
   
    validarToken(req.headers['authorization'], function(tokenValido){

        let data = req.body;
        data.id = req.params.id;

        if(req.file != undefined){
            data.shield = new Buffer(req.file.buffer, 'binary').toString('base64');
        }

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

//eliminación de equipo con proceso hijo.
routerTeams.delete('/:id', (req, res)=>{
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
            res.status(500).json({  success:false,error:'Error borrando equipo.'});
        
        });

        deleteTeamProcess.send(data); 
    });
    
});

//eliminación de todos los equipos
routerTeams.delete('/', (req, res)=>{
       
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

module.exports = routerTeams;