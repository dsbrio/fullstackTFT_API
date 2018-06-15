
var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'tftfullstack', 
    api_key: '825618299169144', 
    api_secret: 'h0eeOMCpOo7BegNlq_8mpvmeSuQ' 
  });

const {savePlayer} = require ('../../model/playerModel.js');

//El proceso hijo de creación de jugador realizará la inserción en base de datos.
process.on('message', (data) => {

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
                process.send(responseBBDD);
             })
             .catch((err) =>{
                 console.log('jugador no creado correctamente.');   
                 process.exit();
             });
        }
        
    });


});

