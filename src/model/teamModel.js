

const mongoose = require('mongoose');

mongodb://<dbteam>:<dbpassword>@ds016118.mlab.com:16118/tft
//mongoose.connect('mongodb://ds016118.mlab.com:16118/tft');
mongoose.connect('mongodb://tft:tft@ds016118.mlab.com:16118/tft');
mongoose.Promise = global.Promise;

const TeamSchema = mongoose.Schema({
    id : String,
	shield: String,
    name :String,
    colors : String,
    stadium : String,
    players: [{
        name: String,
		secondname: String,
		age: Number,
		position: String,
        characteristics: {
            attack: String,
            defense: String,
			condition: String
        },
		comments: String
    }]
});


const Team = mongoose.model('Team', TeamSchema);

//Inserta el modelo en base de datos
exports.saveTeam = (data) =>{
    return (new Team(data)).save();
};

//obtienen el listado de todos los equipos.
exports.getTeams = ()=>{

    //realizamos la búsqueda de todos los equipos.
    let listTeams = Team.find({}).exec();
    return listTeams;
};

//obtiene el equipo por su id.
exports.getTeamById = (teamId)=>{

    //formamos el json con el cual realizar la búsqueda.
    let jsonBusqueda= {_id:teamId};
    //obtenemos el listado de equipos por busqueda, en este caso solo saldra uno.
    let listTeams = Team.find(jsonBusqueda).exec();

    return listTeams;
};

//Actualiza el modelo en base de datos
exports.updateTeam = (data) =>{

    let jsonBusqueda= {_id:data.id};

    var newvalues ={$set: {name: data.name, colors: data.colors, stadium:data.stadium } };

    return Team.findOneAndUpdate(jsonBusqueda,newvalues);
   
};

//Borrado de un equipo por id.
exports.deleteTeam = (data) =>{
    let jsonBusqueda= {_id:data.id};
    return Team.remove(jsonBusqueda);
};

//Borrado de todos los equipos.
exports.deleteAll = () =>{
    return Team.remove({});
};

