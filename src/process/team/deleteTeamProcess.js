
//importamos el modelo de equipo para poder relacionarnos con la base de datos.
const {deleteTeam} = require ('../../model/teamModel.js');

//El proceso hijo de creación de equipo realizará la inserción en base de datos del equipo.
process.on('message', (data) => {
	deleteTeam(data).then(() => {
		console.log('equipo actualizado correctamente.');
	process.send(data);
	 })
	 .catch(() =>{
		 console.log('equipo no actualizado correctamente.');   
	 console.log(err);   
	 process.exit();
	 });
});
