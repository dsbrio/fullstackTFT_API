
//importamos el modelo de jugador para poder relacionarnos con la base de datos.
const {deletePlayer} = require ('../../model/playerModel.js');

//El proceso hijo de eliminación borrara de base de datos al jugador
process.on('message', (data) => {
	deletePlayer(data).then(() => {
		console.log('Jugador eliminado correctamente.');
		process.send(data);
	 })
	 .catch((err) =>{
		 console.log('Jugador no eliminado correctamente.');   
	 	console.log(err);   
	 	process.exit();
	 });
});
