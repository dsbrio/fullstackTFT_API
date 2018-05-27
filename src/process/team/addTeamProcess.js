
//importamos el modelo de equipo para poder relacionarnos con la base de datos.
const {saveTeam} = require ('../../model/teamModel.js');

//El proceso hijo de creación de equipo realizará la inserción en base de datos del equipo.
process.on('message', (data) => {
 
    saveTeam(data).then((responseBBDD) => {
        console.log('equipo creado correctamente.');
        process.send(responseBBDD);


     })
     .catch((err) =>{
         console.log('equipo no creado correctamente.');   
         process.exit();
     });

});

