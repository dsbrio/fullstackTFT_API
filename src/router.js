
const express = require('express');
const { fork } = require('child_process');

const addTeamProcessUrl = './src/process/team/addTeamProcess.js';
const updateTeamProcessUrl = './src/process/team/updateTeamProcess.js';
const deleteTeamProcessUrl = './src/process/team/deleteTeamProcess.js';

//importamos solo las funciones del modelo que vamos a usar desde el router.
const {getTeams, getTeamById, deleteTeam, deleteAll} = require('./model/TeamModel.js');

const router = express.Router();

//creación del equipo con proceso hijo.
router.post('/team',(req,res)=>{
    
    //obtenemos el campo body de la petición
    let data = req.body;

    //Obtenemos el proceso hijo
    const addTeamProcess = fork(addTeamProcessUrl);

    //añadimos un evento al proceso hijo, para que envie los datos del json de respuesta.
    addTeamProcess.on('message', (responseBBDD) => {
        res.status(201).json(responseBBDD);
    });

    addTeamProcess.on('exit', () => {
        //Respondemos con OK
        res.status(500).json({error:'Error creando equipo.'});
       
    });

    //ejecutamos el proceso.
    addTeamProcess.send(data);
   
});

//listado de equipo sin proceso hijo
router.get('/teams', (req, res)=>{

    //obtenemos los resultados.
    getTeams().then((data)=>{
        console.log('Lista de equipos obtenida.');

        res.status(200).json(data);

    }).catch((err) => {
        console.log('Error obteniendo lista de equipos');
        console.log(err);
        res.status(500).json({success:false});
    });
});

//busqueda de equipo por id sin proceso hijo
router.get('/teams/:id', (req, res)=>{

    let teamId = req.params.id;

    getTeamById(teamId).then((data)=>{
        console.log('Equipo obtenido correctamente.');

        res.status(200).json(data);

    }).catch((err) => {
        console.log('Error obteniendo equipo');
        console.log(err);
        res.status(500).json({success:false});
    });
});


//actualización de usuario con proceso hijo.
router.patch('/teams/:id', (req, res)=>{
   
    
    let data = req.body;
    data.id = req.params.id;

    //realizamos llamada al proceso hijo.
    const updateTeamProcess = fork(updateTeamProcessUrl);
   
    //añadimos un evento al proceso hijo, para que envie los datos del json de respuesta.
    updateTeamProcess.on('message', (responseUpdateBBDD) => {
        //Respondemos con OK
         res.status(201).json(responseUpdateBBDD);
    });

    updateTeamProcess.on('exit', () => {
        //Respondemos con OK
        res.status(500).json({error:'Error actualizando usuario.'});
       
    });

    updateTeamProcess.send(data);   
   
});

//eliminación de usuario sin proceso hijo.
router.delete('/team/:id', (req, res)=>{
	
    let data = req.body;
    data.id = req.params.id;

	//realizamos llamada al proceso hijo.
    const deleteTeamProcess = fork(deleteTeamProcessUrl);
   
    //añadimos un evento al proceso hijo, para que envie los datos del json de respuesta.
    deleteTeamProcess.on('message', (responseUpdateBBDD) => {
        //Respondemos con OK
         res.status(201).json(responseUpdateBBDD);
    });

    deleteTeamProcess.on('exit', () => {
        //Respondemos con OK
        res.status(500).json({error:'Error actualizando usuario.'});
       
    });

    deleteTeamProcess.send(data); 
    
});

//eliminación de todos los usuarios
router.delete('/teams', (req, res)=>{
       
    deleteAll().then((data)=>{
        console.log('Equipos borrados correctamente')
        res.status(200).json({success:true});

    }).catch((err) => {
        console.log('Error borrando equipos');
        console.log(err);
        res.status(500).json({success:false});
    });   
});


module.exports = router;