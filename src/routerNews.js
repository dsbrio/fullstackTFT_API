
const express = require('express');
const { fork } = require('child_process');

const {validarToken} = require('./utileria/login.js');

//importamos solo las funciones del modelo que vamos a usar desde el router.
const {saveNews, getAllNews,getNewsAfterDate, deleteAllNews} = require('./model/newsModel.js');

const addNewsProcessUrl = 'src/process/news/addNewsProcess.js';

const routerNews = express.Router();


//creación del noticia con proceso hijo.
routerNews.post('/',(req,res)=>{

    validarToken(req.headers['authorization'], function(tokenValido){

        console.log('tokenValido',tokenValido);

        if(tokenValido){
            let data = req.body;

            //realizamos llamada al proceso hijo.
            const addNewsProcess = fork(addNewsProcessUrl);

            //añadimos un evento al proceso hijo, para que envie los datos del json de respuesta.
            addNewsProcess.on('message', (responseUpdateBBDD) => {
                //Respondemos con OK
                var response = {
                    success:true
                };
                res.status(201).json(response);
            });

            addNewsProcess.on('exit', () => {
                //Respondemos con OK
                res.status(500).json({success:false,error:'Error creando noticia.'});

            });

            addNewsProcess.send(data);   

        }else{
            //token no valido, 401
            res.status(401).json({success:false, message:"No autorizado."});
        }
    });

});


//obtención de noticias
routerNews.get('/',(req,res)=>{
    
    getAllNews().then((data)=>{
        console.log('Noticias obtenidas correctamente');
        var response = {
            success:true,
            data:data
        };
        res.status(200).json(response);

    }).catch((err) => {
        console.log('Error obteniendo noticias');
        console.log(err);
        res.status(500).json({success:false});
    });  
    
});

//obtención de noticias posteriores a cierta fecha
routerNews.get('/filter',(req,res)=>{
    
    
    if(req.query != null && req.query.date != null && Date.parse(req.query.date) != NaN){
        let date = new Date(req.query.date);
        console.log(date);
    
        getNewsAfterDate(date).then((data)=>{
            console.log('Noticias obtenidas correctamente');
            var response = {
                success:true,
                data:data
            };
            res.status(200).json(response);

        }).catch((err) => {
            console.log('Error obteniendo noticias');
            console.log(err);
            res.status(500).json({success:false});
        });  
    }else{
        res.status(500).json({success:false, message:"Falta fecha de filtro o formato incorrecto => ?date=YYYY-MM-dd"});
    }
        
});


//borra las noticias de la BD
routerNews.delete('/', (req, res)=>{
    
    validarToken(req.headers['authorization'], function(tokenValido){

        console.log('tokenValido',tokenValido);
    
        deleteAllNews().then((data)=>{
            console.log('Noticias borradas correctamente');
            var response = {
                success:true
            };
            res.status(200).json(response);
    
        }).catch((err) => {
            console.log('Error borrando noticias');
            console.log(err);
            res.status(500).json({success:false});
        });  

    });
    
});

module.exports = routerNews;