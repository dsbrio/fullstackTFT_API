
var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'tftfullstack', 
    api_key: '825618299169144', 
    api_secret: 'h0eeOMCpOo7BegNlq_8mpvmeSuQ' 
  });

//importamos el modelo de equipo para poder relacionarnos con la base de datos.
const {saveTeam} = require ('../../model/teamModel.js');

//El proceso hijo de creación de equipo realizará la inserción en base de datos del equipo.
process.on('message', (data) => {

    cloudinary.v2.uploader.upload("data:image/png;base64,"+ data.shield, 
    function(error, result) {
        if(error){
            console.log('fallo al subir escudo a la nube'); 
            console.log(error);  

            data.shield = "";

            saveTeamData(data);
        }else{
            console.log("escudo del equipo subido a la nube");

            //en BD guardamos no el escudo en base64, sino la url que nos devuelve cloudinary
            data.shield = result.url;

            saveTeamData(data);
        }
        
    });


});

function saveTeamData(data) {

    if(data['history.goals'] != undefined && isNaN(data['history.goals'])){
        data['history.goals'] = 0;
    }
    if(data['history.titles'] != undefined && isNaN(data['history.titles'])){
        data['history.titles'] = 0;
    }

    saveTeam(data).then((responseBBDD) => {
        console.log('equipo creado correctamente.');
        process.send(responseBBDD);
     })
     .catch((err) =>{
         console.log('equipo no creado correctamente.');  
         console.log(err);  
         process.exit();
     });
}

