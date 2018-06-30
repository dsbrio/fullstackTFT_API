
const express = require('express');

const routerTransferHistory = express.Router();

const {findTransferHistoryWithData} = require ('./model/transferHistoryModel.js');


routerTransferHistory.get('/:id',(req,res)=>{
    
    var jsonBusqueda={playerId : req.params.id};

    findTransferHistoryWithData(jsonBusqueda).then((data)=>{
         
          var response = {
            success:true,
            playerInfo : {},
            data:[]
          };

          if(null!=data && 0<data.length){

            var playerInfo = {
                name:data[0].playerId.name,
                surname:data[0].playerId.secondname
            }
               
            response.playerInfo = playerInfo;
            response.data = data;
            
            console.log('Historico transferencia de jguador obtenidos correctamente');

            res.status(200).json(response);

          }else{
            console.log('Historico transferencia de jguador obtenidos correctamente');

            res.status(200).json(response);
          }
        
       

    }).catch((err) => {
        console.log('Error obteniendo transferencias de jugador');
        console.log(err);
        res.status(500).json({success:false});
    });  
    
});

module.exports = routerTransferHistory;