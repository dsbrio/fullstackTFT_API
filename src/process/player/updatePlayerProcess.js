//importamos el modelo de equipo para poder relacionarnos con la base de datos.
const {updatePlayer} = require ('../../model/playerModel.js');
const {getDateTime} = require ('../../utileria/general.js');

const {saveTransferHistory,findTransferHistory,updateEndDateTransferHistory} = require ('../../model/transferHistoryModel.js');

var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'tftfullstack', 
    api_key: '825618299169144', 
    api_secret: 'h0eeOMCpOo7BegNlq_8mpvmeSuQ' 
  });

//El proceso hijo de actualización realizará la actualización en base de datos del equipo.
process.on('message', (data) => {

    if(data.photo != null){
        console.log('actualizando foto');

        cloudinary.v2.uploader.upload("data:image/png;base64,"+ data.photo, 
        function(error, result) {
            if(error){
                console.log('equipo no actualizdo correctamente: fallo al subir foto a la nube');   
                process.exit();
            }else{
                
                //en BD guardamos no la imagen en base64, sino la url que nos devuelve cloudinary
                data.photo = result.url;
                update(data);

            }
        });
    }else{
        update(data);
    }
});

function update(data){

    updatePlayer(data).then((responseBBDD) => {
        console.log('Jugador actualizado correctamente.');
        
        if(null!=data.oldTeam && null!=data.team && ""!=data.oldTeam && ""!=data.team
          && data.team!=data.oldTeam){
            //existen los datos de equipo y son distintos

            //buscamos la ultima tranferencia en el historico sin fecha fin para el jugador con el equipo anterior
            let jsonBusqueda= {playerId:data.id, teamId:data.oldTeam, endDate:""};
            findTransferHistory(jsonBusqueda).then((lastTranferHistory) => {
                
                if(null!=lastTranferHistory){
                    //actualizamos fecha de fin

                    updateEndDateTransferHistory(jsonBusqueda,getDateTime()).then((responseUpdateDate) => {
                        //Se ha actualizado la fecha, por tanto creamos un nuevo transfer con el equipo actual
                        //y la fecha fin sin informar.

                        //Componemos el objeto de transferencia
                        var transferHistoryData ={
                            playerId: data.id,
                            teamId : data.team,
                            startDate: getDateTime(),
                            endDate:""
                        };

                        saveTransferHistory(transferHistoryData).then((responsetransfer) =>{

                            process.send(responseBBDD);

                        }).catch((err) =>{
                            console.log('historico de transferencias no creado.',err);
                            process.exit();   
                        });

                    }).catch((err) =>{
                        console.log('historico de transferencias no creado.');
                        process.exit();   
                    });

                }else{

                    //Componemos el objeto de transferencia ya que no habia ninguno antes
                    var transferHistoryData ={
                        playerId: data.id,
                        teamId : data.team,
                        startDate: getDateTime(),
                        endDate:""
                    };

                    saveTransferHistory(transferHistoryData).then((responsetransfer) =>{

                        process.send(responseBBDD);

                    }).catch((err) =>{
                        console.log('historico de transferencias no creado.',err);
                        process.exit();   
                    });

                }

            }).catch((err) =>{
                console.log('historico de transferencias no creado.',err);
                process.exit();   
            });

        }else{
            process.send(responseBBDD);
        }
       
     })
     .catch((err) =>{
         console.log('Jugador no actualizado correctamente.');   
         console.log(err);   
         process.exit();
     });

}