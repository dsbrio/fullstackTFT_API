
var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'tftfullstack', 
    api_key: '825618299169144', 
    api_secret: 'h0eeOMCpOo7BegNlq_8mpvmeSuQ' 
  });

const {saveNews} = require ('../../model/newsModel.js');

//El proceso hijo de creación de jugador realizará la inserción en base de datos.
process.on('message', (data) => {

    cloudinary.v2.uploader.upload("data:image/png;base64,"+ data.photo, 
    function(error, result) {
        if(error){
            console.log('noticia : fallo al subir foto a la nube');  
            console.log(error);
            data.photo = "";

            saveNewsData(data);
        }else{
            console.log("foto de noticia subido a la nube");

            //en BD guardamos no la foto en base64, sino la url que nos devuelve cloudinary
            data.photo = result.url;

           saveNewsData(data);
        }
        
    });

});



function saveNewsData(data) {
    saveNews(data).then((responseBBDD) => {
        console.log('noticia creada correctamente.');
        process.send(responseBBDD);
     })
     .catch((err) =>{
         console.log('noticia no creada correctamente.');   
         console.log(err);
         process.exit();
     });
}