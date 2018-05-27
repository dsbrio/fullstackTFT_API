//importamos el modelo de equipo para poder relacionarnos con la base de datos.
const {updateTeam} = require ('../../model/teamModel.js');

//El proceso hijo de actualización realizará la actualización en base de datos del equipo.
process.on('message', (data) => {
 
    updateTeam(data).then((responseBBDD) => {
        console.log('Equipo actualizado correctamente.');
        process.send(data);
     })
     .catch((err) =>{
         console.log('equipo no actualizado correctamente.');   
         console.log(err);   
         process.exit();
     });

});