//importamos el modelo de equipo para poder relacionarnos con la base de datos.
const {updateNews} = require ('../../model/newsModel.js');

var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'tftfullstack', 
    api_key: '825618299169144', 
    api_secret: 'h0eeOMCpOo7BegNlq_8mpvmeSuQ' 
  });

//El proceso hijo de actualización realizará la actualización en base de datos del equipo.
process.on('message', (data) => {

    if(data.photo != null){
        console.log('actualizando foto de la noticia');

        cloudinary.v2.uploader.upload("data:image/png;base64,"+ data.photo, 
        function(error, result) {
            if(error){
                console.log('noticia no actualizada correctamente: fallo al subir foto a la nube');   
                data.photo = "";
                update(data);
            }else{
                
                //en BD guardamos no el escudo en base64, sino la url que nos devuelve cloudinary
                data.photo = result.url;
                update(data);

            }
        });
    }else{
        update(data);
    }
});

function update(data){

    updateNews(data).then((responseBBDD) => {
        console.log('Noticia actualizada correctamente.');
        process.send(data);
     })
     .catch((err) =>{
         console.log('Noticia no actualizada correctamente.');   
         console.log(err);   
         process.exit();
     });

}