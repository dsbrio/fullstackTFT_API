
var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'tftfullstack', 
    api_key: '825618299169144', 
    api_secret: 'h0eeOMCpOo7BegNlq_8mpvmeSuQ' 
  });

const {savePlayer} = require ('../../model/playerModel.js');
const {saveTransferHistory} = require ('../../model/transferHistoryModel.js');
const {getDateTime} = require ('../../utileria/general.js');

//El proceso hijo de creación de jugador realizará la inserción en base de datos.
process.on('message', (data) => {

    if(null!=data.photo){

        cloudinary.v2.uploader.upload("data:image/png;base64,"+ data.photo,

        function(error, result) {
            if(error){
                console.log('jugador : fallo al subir foto a la nube', error);   
                
                data.photo ="";
                savePlayerData(data);
            }else{
                console.log("foto del jugador subido a la nube");

                //en BD guardamos no el escudo en base64, sino la url que nos devuelve cloudinary
                data.photo = result.url;

                savePlayerData(data);
            }
        
        });

    }else{
        savePlayerData(data);
    }

});


function savePlayerData(data) {

    if(data['characteristics.age'] != undefined && isNaN(data['characteristics.age'])){
        data['characteristics.age'] = 0;
    }
    if(data['characteristics.weight'] != undefined && isNaN(data['characteristics.weight'])){
        data['characteristics.weight'] = 0;
    }
    if(data['characteristics.height'] != undefined && isNaN(data['characteristics.height'])){
        data['characteristics.height'] = 0;
    }
    if(data['statistics.goals'] != undefined && isNaN(data['statistics.goals'])){
        data['statistics.goals'] = 0;
    }
    if(data['statistics.titles'] != undefined && isNaN(data['statistics.titles'])){
        data['statistics.titles'] = 0;
    }
    
    savePlayer(data).then((responseBBDD) => {
           
        //Componemos el objeto de transferencia
        var transferHistoryData ={
            playerId: responseBBDD._id,
            teamId : data.team,
            startDate: getDateTime(),
            endDate:""
        };

        saveTransferHistory(transferHistoryData).then((responsetransfer) =>{
            console.log('jugador creado correctamente.');

            process.send(responseBBDD);

        }).catch((err) =>{

            console.log('historico de transferencias no creado.', err); 
            process.exit();     
        });

    })
    .catch((err) =>{
        console.log('jugador no creado correctamente.', err);   
        process.exit();
    });
}