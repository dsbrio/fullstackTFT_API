
//importamos el modelo de equipo para poder relacionarnos con la base de datos.
const {deleteTeam} = require ('../../model/teamModel.js');
const {deleteAllPlayersByTeamId} = require ('../../model/playerModel.js');

//El proceso hijo de creación de equipo realizará la inserción en base de datos del equipo.
process.on('message', (data) => {

	deleteAllPlayersByTeamId(data.id).then(() => {
		console.log('equipo eliminado correctamente.');

		deleteTeam(data).then(() => {
			console.log('equipo eliminado correctamente.');
			process.send(data);
		 })
		 .catch(() =>{
			 console.log('equipo no eliminado correctamente.');   
		 console.log(err);   
		 process.exit();
		 });

	 })
	 .catch(() =>{
		 console.log('equipo no eliminado correctamente.');   
	 console.log(err);   
	 process.exit();
	 });

	
});
