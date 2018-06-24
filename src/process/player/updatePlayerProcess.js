//importamos el modelo de equipo para poder relacionarnos con la base de datos.
const {updatePlayer} = require ('../../model/playerModel.js');

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
        process.send(data);
     })
     .catch((err) =>{
         console.log('Jugador no actualizado correctamente.');   
         console.log(err);   
         process.exit();
     });

}