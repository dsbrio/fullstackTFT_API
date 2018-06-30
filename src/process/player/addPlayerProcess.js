
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
                console.log('jugador no creado correctamente: fallo al subir foto a la nube');   
                process.exit();
            }else{
                console.log("foto del jugador subido a la nube");

                //en BD guardamos no el escudo en base64, sino la url que nos devuelve cloudinary
                data.photo = result.url;

                savePlayer(data).then((responseBBDD) => {
                    console.log('jugador creado correctamente.');

                    var transferHistoryData ={
                        userId: responseBBDD.id,
                        teamId : responseBBDD.team,
                        startDate: getDateTime(),
                        endDate:""
                    };


                    console.log('transferHistoryData',transferHistoryData);

                    process.send(responseBBDD);
                })
                .catch((err) =>{
                    console.log('jugador no creado correctamente.');   
                    process.exit();
                });
            }
        
        });

    }else{

        savePlayer(data).then((responseBBDD) => {
           
            //Componemos el objeto de transferencia
            var transferHistoryData ={
                userId: responseBBDD._id,
                teamId : data.team,
                startDate: getDateTime(),
                endDate:""
            };

            saveTransferHistory(transferHistoryData).then((responsetransfer) =>{

                console.log('jugador creado correctamente.');

                process.send(responseBBDD);

            }).catch((err) =>{
                console.log('historico de transferencias no creado.');   
            });
            
            

        })
        .catch((err) =>{
            console.log('jugador no creado correctamente.');   
            process.exit();
        });

    }
    


});

