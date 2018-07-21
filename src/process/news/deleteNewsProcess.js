
//importamos el modelo de jugador para poder relacionarnos con la base de datos.
const {deleteNews} = require ('../../model/newsModel.js');

//El proceso hijo de eliminación borrara de base de datos al jugador
process.on('message', (data) => {
	deleteNews(data).then(() => {
		console.log('Noticia eliminada correctamente.');
		process.send(data);
	 })
	 .catch((err) =>{
		 console.log('Noticia no eliminada correctamente.');   
	 	console.log(err);   
	 	process.exit();
	 });
});
