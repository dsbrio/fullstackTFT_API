
const express = require('express');

const routerTransferHistory = express.Router();

const {findTransferHistory} = require ('./model/transferHistoryModel.js');



routerTransferHistory.get('/:id',(req,res)=>{
    
    var jsonBusqueda={playerId : req.params.id};

    findTransferHistory(jsonBusqueda).then((data)=>{
        console.log('Historico transferencia de jguador obtenidos correctamente');
        var response = {
            success:true,
            data:data
        };
        res.status(200).json(response);

    }).catch((err) => {
        console.log('Error obteniendo transferencias de jugador');
        console.log(err);
        res.status(500).json({success:false});
    });  
    
});