
const express = require('express');
const { fork } = require('child_process');

const {validarToken} = require('./utileria/login.js');

//importamos solo las funciones del modelo que vamos a usar desde el router.
const {saveNews, getAllNews,getNewsAfterDate} = require('./model/newsModel.js');

const routerNews = express.Router();


//creación del noticia con proceso hijo.
routerNews.post('/',(req,res)=>{

    validarToken(req.headers['authorization'], function(tokenValido){

        console.log('tokenValido',tokenValido);

        if(tokenValido){

            saveNews(req.body).then((data)=>{
                console.log(req.params);
                var response = {
                    success:true
                };
                res.status(200).json(response);
        
            }).catch((err) => {
                console.log('Error insertando noticias');
                console.log(err);
                res.status(500).json({success:false});
            });  

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

module.exports = routerNews;