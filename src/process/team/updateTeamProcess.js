//importamos el modelo de equipo para poder relacionarnos con la base de datos.
const {updateTeam} = require ('../../model/teamModel.js');

var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'tftfullstack', 
    api_key: '825618299169144', 
    api_secret: 'h0eeOMCpOo7BegNlq_8mpvmeSuQ' 
  });

//El proceso hijo de actualización realizará la actualización en base de datos del equipo.
process.on('message', (data) => {

    if(data.shield != null){
        console.log('actualizando escudo');

        cloudinary.v2.uploader.upload("data:image/png;base64,"+ data.shield, 
        function(error, result) {
            if(error){
                console.log('equipo no actualizdo correctamente: fallo al subir escudo a la nube');
                console.log(error);     
                data.shield = "";
                update(data);
            }else{
                
                //en BD guardamos no el escudo en base64, sino la url que nos devuelve cloudinary
                data.shield = result.url;
                update(data);

            }
        });
    }else{
        update(data);
    }
});

function update(data){

    updateTeam(data).then((responseBBDD) => {
        console.log('Equipo actualizado correctamente.');
        process.send(data);
     })
     .catch((err) =>{
         console.log('equipo no actualizado correctamente.');   
         console.log(err);   
         process.exit();
     });

}